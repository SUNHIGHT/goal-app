import type { ReactNode } from "react";

type HeaderProps = {
    children: ReactNode;
};


export default function Header({children}:HeaderProps){
    return (
         <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>ゴールと進め方アプリ</h1>
            {children}
        </div>
    );
}