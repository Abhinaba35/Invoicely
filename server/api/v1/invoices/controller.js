const Invoice = require('../../../models/invoiceSchema');
const { sendEmail } = require('../../../utils/emailHelpers');
const dotEnv = require('dotenv');
const Razorpay = require('razorpay');

const sendInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id); // client is embedded, no populate

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.status !== 'unpaid' && invoice.status !== 'overdue') {
      return res.status(400).json({ error: 'Invoice is not unpaid or overdue' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentLink = await razorpay.paymentLink.create({
      amount: invoice.total * 100,
      currency: 'INR',
      accept_partial: false,
      description: `Payment for Invoice #${invoice._id}`,
      customer: {
        name: invoice.client.name,
        email: invoice.client.email,
      },
      notify: {
        email: true,
      },
      reminder_enable: true,
      callback_url: `process.env.FRONTEND_URL/invoices`,
      callback_method: 'get',
    });


    // Compose invoice details for email
    let itemsHtml = '';
    if (invoice.items && invoice.items.length > 0) {
      itemsHtml = invoice.items.map((item) => `
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 10px;">${item.description}</td>
          <td style="padding: 10px;">${item.quantity}</td>
          <td style="padding: 10px;">₹${item.price}</td>
          <td style="padding: 10px;">₹${item.tax}</td>
        </tr>
      `).join('');
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #4CAF50; text-align: center;">Invoice Payment</h2>
        <p>Dear ${invoice.client.name},</p>
        <p>Please find the payment link and details for your invoice <strong>#${invoice._id}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left;">Total</th>
            <td style="padding: 10px;">₹${invoice.total}</td>
          </tr>
          <tr>
            <th style="padding: 10px; text-align: left;">Status</th>
            <td style="padding: 10px;">${invoice.status}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left;">Due Date</th>
            <td style="padding: 10px;">${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'}</td>
          </tr>
        </table>

        ${itemsHtml ? `
          <h3 style="color: #4CAF50;">Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead style="background-color: #f2f2f2;">
              <tr>
                <th style="padding: 10px; text-align: left;">Description</th>
                <th style="padding: 10px; text-align: left;">Quantity</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Tax</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        ` : ''}

        <div style="text-align: center; margin: 20px 0;">
          <a href="${paymentLink.short_url}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Pay Now</a>
        </div>

        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${paymentLink.short_url}">${paymentLink.short_url}</a></p>

        <p>Thank you,<br/>Invoicely</p>
      </div>
    `;

    await sendEmail(invoice.client.email, `Payment for Invoice #${invoice._id}`, emailHtml);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending email' });
  }
};

const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    invoiceData.user = req.user._id;
    const invoice = new Invoice(invoiceData);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getInvoice = async (req, res) => {};
// Removed duplicate Invoice require
const listInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateInvoice = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { ...req.body };

    if (status === 'paid') {
      updateData.paidAt = new Date();
    }

    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const backfillPaidInvoices = async (req, res) => {
  try {
    const result = await Invoice.updateMany(
      { status: 'paid', paidAt: { $exists: false } },
      { $set: { paidAt: new Date() } }
    );
    res.json({ message: 'Backfill complete', result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createInvoice,
  getInvoice,
  listInvoices,
  updateInvoice,
  deleteInvoice,
  sendInvoiceEmail,
  backfillPaidInvoices,
};
