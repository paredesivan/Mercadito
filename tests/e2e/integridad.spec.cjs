'use strict';
const {test,expect}=require('@playwright/test');
test.beforeEach(async({page})=>{await page.goto('/');await page.evaluate(async()=>{await window.MercaditoReady;});});
async function nav(page,name){await page.locator('nav[aria-label="Secciones"]').getByRole('link',{name,exact:true}).click();}
async function readState(page){return page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('mercadito-v1',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('data','readonly'),q=tx.objectStore('data').get('state');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error);tx.oncomplete=()=>db.close();};}));}
async function importRows(page,rows){await nav(page,'Artículos');await page.getByRole('button',{name:'Importar planilla'}).click();await page.locator('#modal summary').click();await page.locator('#import-paste').fill(['EAN\tDescripción\tCosto\tPrecio de venta\tLugar de compra',...rows].join('\n'));await page.locator('[data-action="preview-paste"]').click();await page.locator('#apply-import').click();await page.locator('#confirm-yes').click();await expect(page.locator('#modal')).toBeHidden();}
async function form(page,ean='000999'){await nav(page,'Artículos');await page.getByRole('button',{name:'Nuevo artículo'}).click();await page.locator('#product-ean').fill(ean);await page.locator('#product-description').fill('Nuevo jabón');await page.locator('#product-cost').fill('10');await page.locator('#product-price').fill('20');}

test('proveedores únicos al crear, editar y escribir otra capitalización',async({page})=>{
 await importRows(page,['000101\tA\t10\t20\tSEMAC','000102\tB\t10\t20\tsemac','000103\tC\t10\t20\tSemac']);
 await form(page);await expect(page.locator('#product-supplier-select option')).toHaveCount(3);
 await page.locator('#product-supplier-select').selectOption('__new__');await page.locator('#product-supplier-new').fill('  seMAC  ');await page.locator('#product-form button[type="submit"]').click();await expect(page.locator('#modal')).toBeHidden();
 const s=await readState(page);expect(s.products.find(p=>p.ean==='000999').supplier).toBe('SEMAC');
 const row=page.locator('#products-table tbody tr').filter({hasText:'000102'});await row.locator('[data-action="edit-product"]').click();await expect(page.locator('#product-supplier-select')).toHaveValue('SEMAC');await expect(page.locator('#product-supplier-select option')).toHaveCount(3);
});
test('EAN duplicado y costo inválido no alteran registros guardados',async({page})=>{
 await importRows(page,['000101\tOriginal\t10\t20\tSEMAC']);const before=await readState(page);
 await form(page,'000101');await page.locator('#product-form button[type="submit"]').click();await expect(page.locator('#product-form .form-error')).toContainText('Ya existe');expect(await readState(page)).toEqual(before);
 await page.locator('#product-ean').fill('000102');await page.locator('#product-cost').fill('-1');await page.locator('#product-form button[type="submit"]').click();await expect(page.locator('#product-form .form-error')).toContainText('importe válido');expect(await readState(page)).toEqual(before);
 await page.reload();expect(await readState(page)).toEqual(before);
});
test('editar o eliminar artículo no cambia el ticket histórico',async({page})=>{
 await importRows(page,['000101\tOriginal\t10\t20\tSEMAC']);await nav(page,'Nuevo ticket');await page.getByLabel('Buscar artículo para agregar al ticket').fill('000101');await page.locator('[data-action="add-product"]').click();await page.locator('#save-sale').click();await expect(page.locator('#modal')).toBeVisible();await page.locator('#modal [data-action="close-modal"]').click();
 const before=(await readState(page)).invoices;
 await nav(page,'Artículos');await page.locator('[data-action="edit-product"]').click();await page.locator('#product-price').fill('999');await page.locator('#product-description').fill('Modificado');await page.locator('#product-form button[type="submit"]').click();await expect(page.locator('#modal')).toBeHidden();expect((await readState(page)).invoices).toEqual(before);
 await page.locator('[data-action="delete-product"]').click();await page.locator('#confirm-yes').click();await expect(page.locator('#products-table tbody tr')).toHaveCount(0);await page.reload();const state=await readState(page);expect(state.products).toHaveLength(0);expect(state.invoices).toEqual(before);
});
test('importación mixta aplica solo filas válidas y conserva código con ceros',async({page})=>{
 await importRows(page,['000101\tVálido ñ\t10\t20\tSEMAC','000102\tInválido\t-5\t20\tSEMAC','000101\tDuplicado\t10\t20\tSEMAC']);await page.reload();const state=await readState(page);expect(state.products).toHaveLength(1);expect(state.products[0]).toMatchObject({ean:'000101',description:'Válido ñ',costCents:1000,priceCents:2000});
});
test('cancelar la confirmación de importación no cambia el catálogo',async({page})=>{
 await importRows(page,['000101\tOriginal\t10\t20\tSEMAC']);const before=await readState(page);await page.getByRole('button',{name:'Importar planilla'}).click();await page.locator('#modal summary').click();await page.locator('#import-paste').fill('EAN\tDescripción\tCosto\tPrecio de venta\tLugar de compra\n000101\tCambio\t1\t2\tOtro');await page.locator('[data-action="preview-paste"]').click();await page.locator('#apply-import').click();await page.locator('#confirm-no').click();expect(await readState(page)).toEqual(before);await page.reload();expect(await readState(page)).toEqual(before);
});
