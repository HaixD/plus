import { forwardRef, HTMLAttributes } from "react"
import styles from "./styles.module.css"

type PopupContainerProps = {
    isVisible?: boolean
} & HTMLAttributes<HTMLDivElement>

export const PopupContainer = forwardRef<HTMLDivElement, PopupContainerProps>(function Modal({
    isVisible=false,
    style={},
    children,
    ...props
}, ref) {
    return (
        <div 
            id={isVisible ? styles["parent-container"] : styles["parent-hidden"]}
            {...props}
        >
            <div id={styles["child-container"]}>
                {children}
            </div>
        </div>
    )
})