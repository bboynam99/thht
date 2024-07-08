import React, { useState } from 'react';
import { toNano } from '@ton/ton';
import { beginCell } from '@ton/ton';
import { TonConnectUIProvider, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import styles from './Button.module.css'; // Import button styles

const body = beginCell()
    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
    .storeStringTail("MintRandom") // write our text comment
    .endCell();

const myTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
        {
            address: process.env.NEXT_PUBLIC_CONTRACT,
            amount: toNano(5).toString(),
            payload: body.toBoc().toString("base64") // payload with comment in body
        }
    ]
};

export const Mint = () => {
    const [error, setError] = useState(null); // Add state for errors
    const [tonConnectUi] = useTonConnectUI();
    const [tx] = useState(myTransaction);
    const wallet = useTonWallet();

    const handleTransaction = async () => {
        try {
            await tonConnectUi.sendTransaction(tx);
        } catch (e) {
            setError(e.message); // Set the error message
        }
    };

    return (
        <TonConnectUIProvider manifestUrl="https://thht-two.vercel.app/tonconnect-manifest.json">
            <div>
                {wallet ? (
                    <button 
                        className={styles.button}
                        onClick={handleTransaction}
                    >
                        Mint
                    </button>
                ) : (
                    <button 
                        className={styles.button}
                        onClick={() => tonConnectUi.openModal()}
                    >
                        Connect Wallet
                    </button>
                )}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </TonConnectUIProvider>
    );
};
