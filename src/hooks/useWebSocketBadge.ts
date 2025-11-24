import { useEffect, useRef, useState } from 'react';

export function useWebSocketBadge() {
    const [badgeCount, setBadgeCount] = useState(0);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        connectWS();

        return () => {
            ws.current?.close();
        };
    }, []);

    const connectWS = () => {
        ws.current = new WebSocket("wss://online.minii.mn/ws");

        // ws.current.onopen = () => {
        //   console.log("WS Connected");

        //   // Backend expects this EXACT message
        //   ws.current?.send(JSON.stringify({ identifier: "1" }));
        // };

        ws.current.onopen = () => {
            console.log("WS Connected");
            ws.current?.send(JSON.stringify({ identifier: "1" }));

            // console.log("Waiting for initial badge...");
            setTimeout(() => {
                console.log("Badge after 3 sec:", badgeCount);
            }, 3000);
        };

        ws.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // console.log("WS MESSAGE => ", data);

                // Expected response:
                // {"type":"CART_UPDATE","cartCount":5}
                if (data.type === "CART_UPDATE" && typeof data.cartCount === "number") {
                    setBadgeCount(data.cartCount);
                }

            } catch (err) {
                console.log("WS Parse Error => ", err);
            }
        };

        ws.current.onclose = () => {
            // console.log("WS Disconnected... reconnecting in 3 seconds");
            setTimeout(connectWS, 3000);
        };
    };

    return badgeCount;
}
