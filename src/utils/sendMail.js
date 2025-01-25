import nodemailer from "nodemailer";

export const sendMail = ({ to, text, cc , details}) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="text-align: center; color: #007BFF;">Message from Campus Connect</h1>
            <p>Dear User,</p>
            <p style="line-height: 1.6;">
                ${text}
            </p>
            <p>Best Regards,<br>Campus Connect Team</p>
            <p>user Details,</p>
            <p>${details.email}</p>
            <p>${details.userName}</p>
            <p>${details.srmId}</p>
            <p>${details.role}</p>
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666; text-align: center;">
                This email was sent from an unmonitored address. Please do not reply.
                please contact ${cc}.
            </p>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: 'A Mail from Campus Connect',
        cc: cc,
        html: htmlContent, // HTML content for styling
    };

    let value;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            value = true;
        }
    });

    return value;
};
