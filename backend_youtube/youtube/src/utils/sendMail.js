export const sendMailForgotPassword = (res, transporter, mailOption) => {
    return transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            return res.status(500).json({message: "Fail to send mail"});
        }
        return res.status(200).json({message: "Send mail successfully"});
    })
}