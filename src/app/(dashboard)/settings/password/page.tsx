import styles from "../styles.module.css"

export default function Page() {
    return (
        <>
            <h1>Change Username</h1>
            <form action="">
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" required/>
                </div>
                <div>
                    <label htmlFor="verify">Verify Password</label>
                    <input type="password" id="verify" required/>
                </div>
                <input className={`button ${styles.button}`} type="submit" value="Update"/>
            </form>
        </>

    )
}