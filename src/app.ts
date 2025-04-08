import { InversifyExpressServer } from "inversify-express-utils";
import { container } from "./config/InversifyConfig";
import { initializeDatabase } from "./config/DatabaseConfig";



const port = process.env.PORT || 3000;
const rootContext: string = "grievease";

const server= new InversifyExpressServer(container, null, { rootPath: `/${rootContext}` })

const app =server.build();

const startServer = async() => {
    await initializeDatabase();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

startServer().catch(console.error);