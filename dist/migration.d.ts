import { ActorSourcePF2e, UserSourcePF2e } from "foundry-pf2e";
declare global {
    var MODULES_MIGRATIONS: Maybe<{
        done: boolean;
        initialized: boolean;
        list: PreparedModuleMigration[];
        testMigration: typeof testMigration;
    }>;
}
declare function registerMigration(migration: ModuleMigration): void;
declare function testMigration(doc: ClientDocument, version?: number): Promise<object | undefined>;
type PreparedModuleMigration = ModuleMigration & {
    module: string;
};
type ModuleMigration = {
    version: number;
    migrateActor?: (actorSource: ActorSourcePF2e) => Promisable<boolean>;
    migrateUser?: (userSource: UserSourcePF2e) => Promisable<boolean>;
};
export { registerMigration, testMigration };
export type { ModuleMigration };
