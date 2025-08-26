import { MatPaginatorIntl } from "@angular/material/paginator";

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = localStorage.getItem('isalaam-language') === 'id-ID' ? "Items per page:" : localStorage.getItem('isalaam-language') === 'id-ID' ? "Item per halaman:" : localStorage.getItem('isalaam-language') === 'ar-SA' ? "العناصر في الصفحة:" :"Items per page:";
  return customPaginatorIntl;
}