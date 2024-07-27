import { cache } from "react"
import { Client } from "pg"

export const getData = cache(async (name: string) => {
    const client = new Client({
        user: "postgres",
        password: "",
        host: "localhost",
        port: 5432,
        database: ""
    })
    
    await client.connect()
    
    // const data = await client.query(`QUERY HERE`)

    await client.end()
    
    return
});