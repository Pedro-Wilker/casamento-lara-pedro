import * as dotenv from 'dotenv';
import { Client } from '@notionhq/client';
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const databaseId = '2c04b7c5df7d80c8a211e790e3253375';


try {
    const tasks = await notion.dataSources.query({
        data_source_id: databaseId
    });
    
    console.log('Resultado:', JSON.stringify(tasks, null, 2));
} catch (error) {
    console.error('Erro:', error.message);
}