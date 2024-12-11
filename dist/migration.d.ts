import { ActorPF2e, ActorSourcePF2e } from "foundry-pf2e";
declare global {
    var MODULES_MIGRATIONS: Maybe<{
        done: boolean;
        initialized: boolean;
        list: PreparedModuleMigration[];
        testMigration: typeof testMigration;
    }>;
}
declare function registerMigration(migration: ModuleMigration): void;
declare function testMigration(actor: ActorPF2e, version?: number): Promise<object | undefined>;
type PreparedModuleMigration = ModuleMigration & {
    module: string;
};
type ModuleMigration = {
    version: number;
    migrateActor?: (actorSource: ActorSourcePF2e) => Promisable<boolean>;
};
export { registerMigration, testMigration };
export type { ModuleMigration };
