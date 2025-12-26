import { z } from "..";
declare function zFilePath(options: zFilePathOptions | FileCategory[]): z.ZodCustom<FilePath, FilePath>;
type zFilePathOptions = {
    categories?: FileCategory[];
    base64?: boolean;
    virtual?: boolean;
    wildcard?: boolean;
};
export { zFilePath };
export type { zFilePathOptions };
