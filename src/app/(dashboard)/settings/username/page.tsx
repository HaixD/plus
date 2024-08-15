import styles from "../styles.module.css"

export default function Page() {
    return (
        <>
            <h1>Change Username</h1>
            <form action="">
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" required/>
                </div>
                <input className={`button ${styles.button}`} type="submit" value="Update"/>
            </form>
        </>

    )
}