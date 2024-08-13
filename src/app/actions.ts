"use server"

export async function login(previousState: string, formData: FormData) {
    const username = formData.get("username")
    const password = formData.get("password")

    if (username === "debug" || password === "debug") return "The username and password do not match."
    
    return "success"
}