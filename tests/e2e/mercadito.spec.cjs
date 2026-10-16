'use strict';

const fs = require('node:fs');
const { test, expect } = require('@playwright/test');

const pageErrors = new WeakMap();

test.beforeEach(async ({ page }) => {
  pageErrors.set(page, []);
  page.on('pageerror', (error) => pageErrors.get(page).push(error.message));
});

test.afterEach(async ({ page }) => {
  const errors = pageErrors.get(page) || [];
  expect(errors, `Errores JavaScript en la página: ${errors.join(' | ')}`).toEqual([]);
});

async function openApp(page) {
  await page.goto('/');
  await page.evaluate(async () => {
    if (window.MercaditoReady) await window.MercaditoReady;
  });
  await expect(page.locator('#main')).toBeVisible();
}

async function createProduct(page, { ean, description, cost, price }) {
  await page.locator('nav[aria-label="Secciones"]').getByRole('link', { name: 'Artículos' }).click();
  await page.getByRole('button', { name: 'Nuevo artículo' }).click();
  await page.locator('#product-ean').fill(ean);
  await page.locator('#product-description').fill(description);
  await page.locator('#product-cost').fill(cost);
  await page.locator('#product-price').fill(price);
  await page.locator('#product-form button[type="submit"]').click();
  await expect(page.locator('#modal')).toBeHidden();
  await expect(page.locator('#products-table')).toContainText(description);
}

test('la pantalla de autopruebas confirma los cálculos integrados', async ({ page }) => {
  await page.goto('/?mercadito-test=1');
  await expect(page.getByRole('heading', { name: 'Pruebas correctas' })).toBeVisible();
  const checks = await page.locator('.error-page li').count();
  expect(checks).toBeGreaterThanOrEqual(10);
  await expect(page.locator('.error-page > p').first()).toContainText(`${checks} de ${checks} comprobaciones aprobadas`);
});

test('alta de artículo, venta, ticket guardado y resumen sobreviven a recargar', async ({ page }) => {
  await openApp(page);
  await createProduct(page, {
    ean: '0001234567890',
    description: 'Test detergente litro',
    cost: '100,00',
    price: '150,00'
  });

  await page.locator('nav[aria-label="Secciones"]').getByRole('link', { name: 'Nuevo ticket' }).click();
  await page.getByLabel('Buscar artículo para agregar al ticket').fill('Test detergente litro');
  await page.locator('[data-action="add-product"]').click();
  await page.locator('[data-quantity]').fill('2');
  await page.getByLabel('Descuento en pesos').fill('10,00');
  await expect(page.locator('#cart .grand strong')).toContainText('290,00');

  await page.locator('#save-sale').click();
  await expect(page.locator('#modal')).toBeVisible();
  await expect(page.locator('#modal')).toContainText('Test detergente litro');
  await expect(page.locator('#modal')).toContainText('290,00');
  await page.locator('#modal [data-action="close-modal"]').click();

  await page.reload();
  await page.evaluate(async () => { if (window.MercaditoReady) await window.MercaditoReady; });
  await page.locator('nav[aria-label="Secciones"]').getByRole('link', { name: 'Tickets' }).click();
  await expect(page.locator('#invoices-table')).toContainText('N.º 000001');
  await expect(page.locator('#invoices-table')).toContainText('290,00');

  await page.locator('nav[aria-label="Secciones"]').getByRole('link', { name: 'Resumen' }).click();
  await expect(page.locator('.stat').filter({ hasText: 'Total en tickets' })).toContainText('290,00');
  await expect(page.locator('.stat').filter({ hasText: 'Ganancia bruta' })).toContainText('90,00');
});

test('importa planilla pegada, filtra proveedor sin distinguir mayúsculas y exporta CSV', async ({ page }) => {
  await openApp(page);
  await page.locator('nav[aria-label="Secciones"]').getByRole('link', { name: 'Artículos' }).click();
  await page.getByRole('button', { name: 'Importar planilla' }).click();
  await page.locator('#modal summary').click();
  await page.locator('#import-paste').fill([
    'EAN\tDescripción\tCosto\tPrecio de venta\tLugar de compra',
    '0000000000101\tDetergente importado\t100,00\t150,00\tSEMAC',
    '0000000000102\tJabón importado\t50,00\t80,00\tsemac'
  ].join('\n'));
  await page.locator('[data-action="preview-paste"]').click();
  await expect(page.locator('#import-preview-area')).toContainText('2 nuevos');
  await page.locator('#apply-import').click();
  await expect(page.locator('#confirm-dialog')).toBeVisible();
  await page.locator('#confirm-yes').click();
  await expect(page.locator('#modal')).toBeHidden();
  await expect(page.locator('#products-table tbody tr')).toHaveCount(2);

  const supplier = page.locator('#products-supplier');
  await expect(supplier.locator('option')).toHaveCount(2);
  await supplier.selectOption('semac');
  await expect(page.locator('#products-table tbody tr')).toHaveCount(2);
  await expect(page.locator('#products-table')).toContainText('Detergente importado');
  await expect(page.locator('#products-table')).toContainText('Jabón importado');

  const downloadPromise = page.waitForEvent('download');
  await page.locator('[data-action="export-products-csv"]').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^mercadito-articulos-\d{4}-\d{2}-\d{2}\.csv$/);
  const csv = fs.readFileSync(await download.path(), 'utf8');
  expect(csv).toContain('Detergente importado');
  expect(csv).toContain('Jabón importado');
});

test('guarda el tamaño de letra elegido en la configuración', async ({ page }) => {
  await openApp(page);
  await page.getByRole('button', { name: 'Configuración de apariencia y tamaño de letra' }).click();
  await expect(page.locator('#theme-dialog')).toBeVisible();
  await page.locator('#font-size-options [data-font-size="larger"]').click();
  await expect(page.locator('#font-size-options [data-font-size="larger"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('html')).toHaveAttribute('data-font-size', 'larger');

  await page.reload();
  await page.evaluate(async () => { if (window.MercaditoReady) await window.MercaditoReady; });
  await expect(page.locator('html')).toHaveAttribute('data-font-size', 'larger');
});
