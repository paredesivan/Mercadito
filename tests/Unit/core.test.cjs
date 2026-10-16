'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const { URL } = require('node:url');

const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

function readScripts() {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)].map((match) => {
    const attributes = match[1];
    const getAttribute = (name) => {
      const found = attributes.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
      return found ? (found[1] ?? found[2] ?? found[3] ?? '') : '';
    };
    return {
      id: getAttribute('id') || '(sin id)',
      type: getAttribute('type').toLowerCase(),
      src: getAttribute('src'),
      body: match[2]
    };
  });
}

const inlineScripts = readScripts().filter((script) => script.type !== 'text/plain' && !script.src);
const coreScript = inlineScripts.find((script) => script.id === 'mercadito-core');
const selfTestScript = inlineScripts.find((script) => script.id === 'mercadito-tests-inline');
assert.ok(coreScript, 'No se encontró el script mercadito-core en index.html.');
assert.ok(selfTestScript, 'No se encontró el script mercadito-tests-inline en index.html.');

const sandbox = vm.createContext({
  module: { exports: {} },
  crypto: crypto.webcrypto,
  URL
});
new vm.Script(coreScript.body, { filename: 'index.html#mercadito-core' }).runInContext(sandbox);
const C = sandbox.MercaditoCore;

function line(id, priceCents, costCents, quantityMilli) {
  return { id, productId: id, description: id, ean: '', supplier: '', priceCents, costCents, quantityMilli };
}

test('los scripts JavaScript embebidos en index.html tienen sintaxis válida', () => {
  assert.ok(inlineScripts.length >= 5, `Se encontraron solo ${inlineScripts.length} scripts ejecutables.`);
  for (const script of inlineScripts) {
    assert.doesNotThrow(
      () => new vm.Script(script.body, { filename: `index.html#${script.id}` }),
      `Error de sintaxis en el script ${script.id}`
    );
  }
});

test('las autopruebas que ya incluye Mercadito pasan', () => {
  new vm.Script(selfTestScript.body, { filename: 'index.html#mercadito-tests-inline' }).runInContext(sandbox);
  const results = sandbox.MercaditoTests.runSelfTests();
  const failures = results.filter((result) => !result.passed);
  assert.ok(results.length >= 10, `Se esperaban al menos 10 autopruebas integradas; se encontraron ${results.length}.`);
  assert.equal(failures.length, 0, failures.map((result) => `${result.name}: ${result.error}`).join('\n'));
});

test('interpreta importes argentinos y rechaza valores inválidos', () => {
  assert.equal(C.cents('1.234,56'), 123456);
  assert.equal(C.cents('$ 1.234'), 123400);
  assert.equal(C.cents('0,005'), 1);
  assert.throws(() => C.cents('1,2,3'), /importe válido/);
  assert.throws(() => C.cents('-1'), /importe válido/);
});

test('admite cantidades positivas de hasta tres decimales', () => {
  assert.equal(C.quantity('1,234'), 1234);
  assert.equal(C.quantity('0,001'), 1);
  assert.throws(() => C.quantity('0'), /cantidad debe ser positiva/);
  assert.throws(() => C.quantity('1,0001'), /cantidad debe ser positiva/);
});

test('calcula renglones, descuentos y ganancia con redondeo a centavos', () => {
  assert.equal(C.lineAmount(line('a', 1999, 1000, 1500)), 2999);
  const result = C.totals([line('a', 1999, 1000, 1500), line('b', 100, 50, 2000)], 200);
  assert.equal(result.subtotalCents, 3199);
  assert.equal(result.discountCents, 200);
  assert.equal(result.totalCents, 2999);
  assert.equal(result.costCents, 1600);
  assert.equal(result.profitCents, 1399);
  assert.throws(() => C.totals([line('a', 100, 100, 1000)], 101), /no puede superar/);
});

test('crea artículos y bloquea EAN repetidos', () => {
  const product = C.makeProduct({ ean: '0001234567890', description: 'Jabón líquido', cost: '100,00', price: '150,00', supplier: 'Proveedor A' });
  assert.equal(product.ean, '0001234567890');
  assert.equal(product.costCents, 10000);
  assert.equal(product.priceCents, 15000);
  assert.throws(() => C.makeProduct({ description: '', cost: 1, price: 2 }), /descripción/);
  assert.throws(() => C.checkUniqueCode([product], product.ean), /Ya existe un artículo/);
  assert.doesNotThrow(() => C.checkUniqueCode([product], product.ean, product.id));
});

test('valida tickets y conserva numeración sin reutilizar números', () => {
  const draft = { occurredAt: '2026-10-15T12:00', lines: [line('a', 1999, 1000, 1500)], discountCents: 100, payment: 'Efectivo' };
  const invoice = C.buildInvoice(draft, 7);
  assert.equal(invoice.number, 7);
  assert.equal(invoice.totalCents, 2899);
  assert.equal(invoice.profitCents, 1399);
  assert.equal(C.nextInvoiceNumber([{ number: 2 }, { number: 9 }], 3), 10);
  assert.throws(() => C.buildInvoice({ ...draft, occurredAt: '2026-02-30T12:00' }, 8), /fecha y hora válidas/);
  assert.throws(() => C.nextInvoiceNumber([{ number: 999999999 }], 1), /Número: valor inválido/);
});

test('el resumen diario suma solo tickets vigentes del día indicado', () => {
  const current = C.buildInvoice({ occurredAt: '2026-10-15T12:00', lines: [line('a', 300, 100, 1000)], discountCents: 0 }, 1);
  const previous = C.buildInvoice({ occurredAt: '2026-10-14T12:00', lines: [line('b', 500, 200, 1000)], discountCents: 0 }, 2);
  const result = C.daySummary([current, previous, { ...current, id: 'cancelled', number: 3, status: 'cancelled' }], '2026-10-15');
  assert.equal(result.count, 1);
  assert.equal(result.sales, 300);
  assert.equal(result.cost, 100);
  assert.equal(result.profit, 200);
});

test('reconoce encabezados e importa actualizaciones sin duplicar EAN', () => {
  const headers = ['EAN', 'Descripción', 'Costo', 'Precio de venta', 'Lugar de compra'];
  const columns = C.guessColumns(headers);
  assert.equal(columns.ean, 0);
  assert.equal(columns.description, 1);
  assert.equal(columns.cost, 2);
  assert.equal(columns.price, 3);
  assert.equal(columns.supplier, 4);

  const existing = C.makeProduct({ ean: '0000000000001', description: 'Jabón anterior', cost: 50, price: 80, supplier: 'SEMAC' });
  const rows = [
    headers,
    ['0000000000001', 'Jabón actualizado', '60,00', '90,00', 'semac'],
    ['0000000000002', 'Detergente nuevo', '100,00', '150,00', 'Proveedor B'],
    ['0000000000002', 'Fila duplicada', '100,00', '150,00', 'Proveedor B']
  ];
  const result = C.previewImport(rows, columns, [existing]);
  assert.equal(result.added, 1);
  assert.equal(result.updated, 1);
  assert.equal(result.errors.length, 1);
  assert.equal(result.valid[0].product.description, 'Jabón actualizado');
  assert.equal(result.valid[0].product.id, existing.id);

  const addOnly = C.previewImport([headers, rows[1]], columns, [existing], 'add');
  assert.equal(addOnly.skipped.length, 1);
  assert.equal(addOnly.valid.length, 0);
});

test('exporta CSV escapado y protege fórmulas', () => {
  const result = C.csv([['EAN', 'Descripción'], ['0001', '=1+1;"jabón"']]);
  assert.ok(result.startsWith('\ufeff'));
  assert.ok(result.includes("'=1+1;\"\"jabón\"\""));
  assert.ok(result.includes('\r\n'));
});

test('decodifica QR JSON y enlaces GS1 sin alterar códigos comunes', () => {
  assert.equal(C.decodeCode('{"ean":"000123"}'), '000123');
  assert.equal(C.decodeCode('https://example.test/01/00012345678905'), '00012345678905');
  assert.equal(C.decodeCode('codigo-ABC'), 'codigo-ABC');
});

test('valida copias, calcula el próximo ticket y rechaza importes adulterados', () => {
  const state = C.defaultState();
  const product = C.makeProduct({ ean: '0001', description: 'Artículo', cost: '1,00', price: '2,00' });
  state.products.push(product);
  const invoice = C.buildInvoice({
    occurredAt: '2026-10-15T12:00',
    lines: [{ ...line('line-1', product.priceCents, product.costCents, 1000), productId: product.id, ean: product.ean, description: product.description }],
    discountCents: 0,
    payment: 'Efectivo'
  }, 1);
  state.invoices.push(invoice);
  state.nextNumber = 1;

  const backup = C.validateBackup({ format: 'mercadito-backup', version: 1, state });
  assert.equal(backup.nextNumber, 2);
  assert.equal(backup.products.length, 1);
  assert.equal(backup.invoices[0].totalCents, 200);
  assert.throws(() => C.validateBackup({ format: 'mercadito-backup', version: 1, state: { ...state, invoices: [{ ...invoice, totalCents: 999 }] } }), /importes inconsistentes/);
  assert.throws(() => C.validateBackup({ format: 'mercadito-backup', version: 1, state: { ...state, products: [product, { ...product, id: 'another-id' }] } }), /duplicados/);
});

test('acepta el 29 de febrero de año bisiesto y rechaza fechas imposibles', () => {
  assert.equal(C.validDateTime('2024-02-29T12:30'), true);
  assert.equal(C.validDateTime('2025-02-29T12:30'), false);
  assert.equal(C.validDateTime('2026-13-01T12:30'), false);
});
