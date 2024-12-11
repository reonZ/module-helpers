import { ActorSourcePF2e, UserSourcePF2e } from "foundry-pf2e";
declare global {
    var MODULES_MIGRATIONS: Maybe<{
        done: boolean;
        initialized: boolean;
        modules: Map<string, MigrationModuleFunctions>;
        list: PreparedModuleMigration[];
        get context(): MigrationModuleFunctions;
        testMigration: typeof testMigration;
        runMigrations: typeof runMigrations;
    }>;
}
declare function registerMigration(migration: ModuleMigration): void;
declare function testMigration(doc: ClientDocument): Promise<object | undefined>;
declare function runMigrations(): Promise<void>;
type PreparedModuleMigration = ModuleMigration & {
    module: string;
};
type ModuleMigration = {
    version: number;
    migrateActor?: (actorSource: ActorSourcePF2e) => Promisable<boolean>;
    migrateUser?: (userSource: UserSourcePF2e) => Promisable<boolean>;
};
type MigrationModuleFunctions = {
    managerVersion: number;
    module: string;
    testMigration: typeof testMigration;
    runMigrations: typeof runMigrations;
};
export { registerMigration };
export type { ModuleMigration };
