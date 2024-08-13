import styles from "./styles.module.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={styles.page}>{children}</body>
    </html>
  );
}
