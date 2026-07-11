import { TenantContextService } from '../tenants/tenant-context.service';
import { CategoriesService } from '../categories/categories.service';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { TablesService } from '../tables/tables.service';
export declare class PublicController {
    private readonly tablesService;
    private readonly categoriesService;
    private readonly menuItemsService;
    private readonly tenantContext;
    constructor(tablesService: TablesService, categoriesService: CategoriesService, menuItemsService: MenuItemsService, tenantContext: TenantContextService);
    getMenu(qrCode: string): Promise<{
        table: import("../tables/types/table-record").TableDto;
        categories: import("../categories/types/category-record").CategoryDto[];
        menuItems: import("../menu-items/types/menu-item-record").MenuItemDto[];
    }>;
}
