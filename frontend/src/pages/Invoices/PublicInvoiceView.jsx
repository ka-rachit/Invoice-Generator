import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../../utils/apiPaths";
import {Loader2, Printer, AlertCircle, FileText} from "lucide-react";

const PublicInvoiceView = () => {
    const {id} = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/invoices/public/${id}`);
                setInvoice(response.data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-slate-600 font-medium">Loading invoice...</p>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">Invoice Not Found</h2>
                    <p className="text-slate-500">
                        The invoice you are looking for doesn't exist or the link may have expired.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            {/* Top Bar */}
            <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-950 to-blue-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">Invoice #{invoice.invoiceNumber}</h1>
                        <p className="text-xs text-slate-500">Shared via Invoice Generator</p>
                    </div>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-950 to-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    <Printer className="w-4 h-4" />
                    <span>Print / Download</span>
                </button>
            </div>

            {/* Invoice Content */}
            <div id="invoice-content-wrapper" className="max-w-3xl mx-auto">
                <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-md border border-slate-200" id="invoice-preview">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b border-slate-200">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">INVOICE</h2>
                            <p className="text-sm text-slate-500 mt-2"># {invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-left sm:text-right mt-4 sm:mt-0">
                            <p className="text-sm text-slate-500">Status</p>
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    invoice.status === "Paid"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : invoice.status === "Pending"
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {invoice.status}
                            </span>
                        </div>
                    </div>

                    {/* Bill From / Bill To */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Bill From
                            </h3>
                            <p className="font-semibold text-slate-800">{invoice.billFrom?.businessName}</p>
                            <p className="text-slate-600">{invoice.billFrom?.address}</p>
                            <p className="text-slate-600">{invoice.billFrom?.email}</p>
                            <p className="text-slate-600">{invoice.billFrom?.phone}</p>
                        </div>
                        <div className="sm:text-right">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Bill To
                            </h3>
                            <p className="font-semibold text-slate-800">{invoice.billTo?.clientName}</p>
                            <p className="text-slate-600">{invoice.billTo?.address}</p>
                            <p className="text-slate-600">{invoice.billTo?.email}</p>
                            <p className="text-slate-600">{invoice.billTo?.phone}</p>
                        </div>
                    </div>

                    {/* Dates & Terms */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 my-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Invoice Date
                            </h3>
                            <p className="font-medium text-slate-800">
                                {new Date(invoice.invoiceDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Due Date
                            </h3>
                            <p className="font-medium text-slate-800">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 text-right uppercase tracking-wider mb-3">
                                Payment Terms
                            </h3>
                            <p className="font-medium text-right text-slate-800">{invoice.paymentTerms}</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Qty
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {invoice.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-900">
                                            {item.name}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-center font-medium text-slate-600">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-right font-medium text-slate-600">
                                            ₹{item.unitPrice.toFixed(2)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 text-sm text-right font-medium text-slate-900">
                                            ₹{item.total.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mt-8">
                        <div className="w-full max-w-sm space-y-3">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{invoice.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax</span>
                                <span>₹{invoice.taxTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg text-slate-900 pt-3 mt-3 border-t border-slate-200">
                                <span>Total</span>
                                <span>₹{invoice.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                Notes
                            </h3>
                            <p className="text-sm text-slate-600">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-12 pt-6 text-center text-xs text-slate-400">
                        Created with <span className="font-semibold">Invoice Generator</span>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style>
                {`
                    @page {
                        padding: 10px;
                    }

                    @media print {
                        body * {
                            visibility: hidden;
                        }

                        #invoice-content-wrapper,
                        #invoice-content-wrapper * {
                            visibility: visible;
                        }

                        #invoice-content-wrapper {
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            width: 100%;
                        }

                        #invoice-preview {
                            box-shadow: none;
                            border: none;
                            border-radius: 0;
                            padding: 20px;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default PublicInvoiceView;
