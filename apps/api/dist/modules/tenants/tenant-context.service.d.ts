export interface TenantContextValue {
    readonly id: number;
    readonly slug: string;
    readonly status: string;
}
export declare class TenantContextService {
    private readonly storage;
    run(context: TenantContextValue, next: () => void): void;
    current(): TenantContextValue | undefined;
    requireId(): number;
}
