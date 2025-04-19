declare function registerMigrations(migrations?: ModuleMigrations): void;
type ModuleMigration = {};
type ModuleMigrations = ModuleMigration[] | Record<string, ModuleMigration>;
export { registerMigrations };
export type { ModuleMigration, ModuleMigrations };
