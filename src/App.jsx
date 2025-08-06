import { useState } from 'react';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import bs58 from 'bs58';

function App() {
  const [privateKey, setPrivateKey] = useState('');
  const [recipients, setRecipients] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleDisperse = async () => {
    try {
      setStatus('Processing...');

      const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/t1AL5dEx7SLqxkam4yE40SAkPbj5gSYa');
      const secretKey = bs58.decode(privateKey.trim());
      const sender = Keypair.fromSecretKey(secretKey);

      const recipientList = recipients.trim().split('\n').filter(Boolean);

      for (let recipient of recipientList) {
        const instruction = SystemProgram.transfer({
          fromPubkey: sender.publicKey,
          toPubkey: new PublicKey(recipient.trim()),
          lamports: Math.floor(parseFloat(amount) * 1e9),
        });

        const transaction = new Transaction().add(instruction);
        const signature = await sendAndConfirmTransaction(connection, transaction, [sender]);

        console.log(`Sent to ${recipient.trim()}: ${signature}`);
      }

      setStatus('Disperse Complete!');
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Solana Disperse</h1>
      <textarea placeholder="Private Key (Base58)" onChange={(e) => setPrivateKey(e.target.value)} rows="2" cols="50" /><br />
      <textarea placeholder="Recipient Addresses (one per line)" onChange={(e) => setRecipients(e.target.value)} rows="10" cols="50" /><br />
      <input type="text" placeholder="Amount in SOL" onChange={(e) => setAmount(e.target.value)} /><br />
      <button onClick={handleDisperse}>Disperse</button>
      <p>{status}</p>
    </div>
  );
}

export default App;
