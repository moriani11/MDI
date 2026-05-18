declare module "connect-mongo" {
    import session from "express-session";
    import { MongoClient } from "mongodb";

    interface MongoStoreOptions {
        mongoUrl?: string;
        clientPromise?: Promise<MongoClient>;
        dbName?: string;
        collectionName?: string;
        ttl?: number;
        autoRemove?: "native" | "interval" | "disabled";
        touchAfter?: number;
        stringify?: boolean;
    }

    class MongoStore extends session.Store {
        static create(options: MongoStoreOptions): MongoStore;
        on(event: "error", callback: (error: Error) => void): this;
        close(): Promise<void>;
    }

    export default MongoStore;
}
