import React, { useMemo, useState } from 'react';
import { ArrowLeft, Plus, Trash2, Printer, RotateCcw, ReceiptText, ChevronDown } from 'lucide-react';

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n) || 0);
const today = () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

export default function App() {
  const [clinic, setClinic] = useState({ name: 'Matritva Ayur Care', subtitle: 'മാതൃത്വ ആയുർ കെയർ', tagline: 'COMPLETE WELLNESS FOR WOMEN', address: 'Peroor, Ettumanoor', district: 'Kottayam, Kerala', phone: '' });
  const [patient, setPatient] = useState('');
  const [place, setPlace] = useState('');
  const [date, setDate] = useState(today());
  const [receiptNo, setReceiptNo] = useState('');
  const [items, setItems] = useState([]);
  const [received, setReceived] = useState('0');
  const [showSettings, setShowSettings] = useState(false);
  const total = useMemo(() => items.reduce((s, item) => s + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0), [items]);
  const balance = total - (Number(received) || 0);
  const updateItem = (id, key, value) => setItems(old => old.map(x => x.id === id ? { ...x, [key]: value } : x));
  const addItem = () => setItems(old => [...old, { id: Date.now(), description: '', qty: 1, rate: 0 }]);
  const reset = () => { setPatient(''); setPlace(''); setDate(today()); setReceiptNo(''); setItems([]); setReceived('0'); };

  return <div className="app-shell">
    <header className="topbar no-print">
      <button className="back-button" onClick={() => window.history.length > 1 ? window.history.back() : reset()}><ArrowLeft size={18}/> <span>Back</span></button>
      <div className="top-actions"><button className="quiet-button" onClick={() => setShowSettings(v => !v)}>Clinic details <ChevronDown size={16}/></button><button className="print-button" onClick={() => window.print()}><Printer size={17}/> <span>Print receipt</span></button></div>
    </header>

    {showSettings && <section className="settings-card no-print">
      <div className="section-heading"><div><span className="eyebrow">SETUP</span><h2>Clinic details</h2></div><button className="text-button" onClick={() => setShowSettings(false)}>Done</button></div>
      <div className="settings-grid">
        <Field label="Clinic name" value={clinic.name} onChange={v => setClinic({...clinic, name:v})}/>
        <Field label="Malayalam name" value={clinic.subtitle} onChange={v => setClinic({...clinic, subtitle:v})}/>
        <Field label="Tagline" value={clinic.tagline} onChange={v => setClinic({...clinic, tagline:v})}/>
        <Field label="Address line 1" value={clinic.address} onChange={v => setClinic({...clinic, address:v})}/>
        <Field label="Address line 2" value={clinic.district} onChange={v => setClinic({...clinic, district:v})}/>
        <Field label="Phone (optional)" value={clinic.phone} onChange={v => setClinic({...clinic, phone:v})}/>
      </div>
    </section>}

    <main className="workspace">
      <section className="editor no-print">
        <div className="page-intro"><span className="eyebrow">BILLING DESK</span><h1>Create receipt</h1><p>Enter the details below. Your receipt updates instantly.</p></div>
        <div className="form-card">
          <div className="section-heading"><div><span className="step">01</span><div><h2>Patient details</h2><p>Who is this receipt for?</p></div></div></div>
          <div className="field-grid">
            <Field label="Patient name" value={patient} onChange={setPatient} placeholder="Enter patient name"/>
            <Field label="Place / address" value={place} onChange={setPlace} placeholder="Enter place"/>
            <Field label="Date of issue" value={date} onChange={setDate}/>
            <Field label="Receipt number" value={receiptNo} onChange={setReceiptNo}/>
          </div>
        </div>

        <div className="form-card items-card">
          <div className="section-heading"><div><span className="step">02</span><div><h2>Bill items</h2><p>Add services and products</p></div></div><span className="item-count">{items.length} items</span></div>
          <div className="items-editor">
            {items.map((item, i) => <div className="item-editor-row" key={item.id}>
              <div className="item-number">{String(i + 1).padStart(2,'0')}</div>
              <div className="item-fields">
                <label className="input-label">Description<input value={item.description} onChange={e => updateItem(item.id,'description',e.target.value)} placeholder="Service or product"/></label>
                <div className="numeric-fields">
                  <label className="input-label">Qty<input type="number" min="0" inputMode="decimal" value={item.qty} onChange={e => updateItem(item.id,'qty',e.target.value)}/></label>
                  <label className="input-label">Rate (₹)<input type="number" min="0" inputMode="decimal" value={item.rate} onChange={e => updateItem(item.id,'rate',e.target.value)}/></label>
                  <div className="line-total"><span>Amount</span><strong>{money((Number(item.qty)||0)*(Number(item.rate)||0))}</strong></div>
                </div>
              </div>
              <button className="delete-button" aria-label="Remove item" onClick={() => setItems(old => old.filter(x => x.id !== item.id))}><Trash2 size={17}/></button>
            </div>)}
          </div>
          <button className="add-item-button" onClick={addItem}><Plus size={17}/> Add another item</button>
        </div>

        <div className="form-card payment-card">
          <div className="section-heading"><div><span className="step">03</span><div><h2>Payment</h2><p>Enter the amount received</p></div></div></div>
          <div className="payment-fields">
            <div className="total-preview"><span>Bill total</span><strong>{money(total)}</strong></div>
            <Field label="Amount received (₹)" value={received} onChange={setReceived} type="number" placeholder="0"/>
            <div className="balance-preview"><span>Balance payable</span><strong>{money(balance)}</strong></div>
          </div>
        </div>
        <div className="mobile-print-bar"><div><span>Grand total</span><strong>{money(total)}</strong></div><button className="print-button" onClick={() => window.print()}><Printer size={17}/> Print</button></div>
        <div className="editor-bottom-actions"><button className="reset-button" onClick={reset}><RotateCcw size={16}/> Clear form</button><button className="print-button large-print" onClick={() => window.print()}><Printer size={17}/> Print receipt</button></div>
      </section>

      <section className="preview-column">
        <div className="preview-label no-print"><span><ReceiptText size={16}/> LIVE PREVIEW</span><span>Print-ready A4</span></div>
        <article className="receipt" id="receipt">
          <div className="receipt-topline"></div>
          <div className="receipt-content">
            <div className="receipt-header">
              <div className="brand"><img className="clinic-logo" src="/logoayur.png" alt="Matritva Ayur Care logo"/><div className="brand-copy"><div className="brand-name">{clinic.name || 'Clinic name'}</div><div className="brand-subtitle">{clinic.subtitle}</div><div className="brand-tagline">{clinic.tagline}</div></div></div>
              <div className="clinic-address"><strong>{clinic.address}</strong><span>{clinic.district}</span>{clinic.phone && <span>{clinic.phone}</span>}<span className="receipt-number">Receipt #{receiptNo}</span></div>
            </div>
            <div className="receipt-divider"></div>
            <div className="patient-strip">
              <div><span className="receipt-label">PATIENT DETAILS</span><strong>{patient || 'Patient name'}</strong><span>Place: {place || '—'}</span></div>
              <div className="issue-date"><span className="receipt-label">DATE OF ISSUE</span><strong>{date || '—'}</strong></div>
            </div>
            <div className="receipt-table">
              <div className="table-head"><span>DESCRIPTION</span><span>AMOUNT</span></div>
              {items.filter(x => x.description.trim() || Number(x.rate)).map(item => <div className="table-row" key={item.id}><span>{item.description || '—'}{Number(item.qty) > 1 && <small> × {item.qty}</small>}</span><span>{money((Number(item.qty)||0)*(Number(item.rate)||0))}</span></div>)}
              {items.every(x => !x.description.trim() && !Number(x.rate)) && <div className="empty-row">Bill items will appear here</div>}
            </div>
            <div className="receipt-totals">
              <div><span>Total Amount</span><strong>{money(total)}</strong></div>
              <div><span>Amount Received</span><strong className="received-amount">{money(received)}</strong></div>
              <div className="balance-row"><span>Balance Payable</span><strong>{money(balance)}</strong></div>
            </div>
            <div className="receipt-footer"><div className="thank-you">Thank you for choosing {clinic.name || 'us'}</div><div className="footer-tagline">YOUR WELLNESS IS OUR PRIORITY</div></div>
          </div>
        </article>
        <p className="preview-hint no-print">This is how your receipt will look when printed or saved as PDF.</p>
      </section>
    </main>
    <footer className="app-footer no-print">Simple billing · No account · No data saved</footer>
  </div>;
}

function Field({ label, value, onChange, placeholder = '', type = 'text' }) {
  return <label className="input-label">{label}<input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/></label>;
}