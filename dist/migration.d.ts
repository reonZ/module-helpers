import { ActorSourcePF2e } from "foundry-pf2e";
declare global {
    var MODULES_MIGRATIONS: Maybe<{
        done: boolean;
        initialized: boolean;
        list: PreparedModuleMigration[];
    }>;
}
declare function registerMigration(migration: ModuleMigration): void;
type PreparedModuleMigration = ModuleMigration & {
    module: string;
};
type ModuleMigration = {
    version: number;
    migrateActor?: (actorSource: ActorSourcePF2e) => Promisable<boolean>;
};
export { registerMigration };
export type { ModuleMigration };
