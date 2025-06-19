import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="margin: 0; padding: 0; background-color: #f6fdf8; font-family: 'Segoe UI', sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6fdf8; padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding: 40px 0 10px;">
                <img src="https://movicare-dashboard.netlify.app/logo.png" alt="CarRent Logo" width="120" style="display:block;" />
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td align="center" style="padding: 0 40px;">
                <h1 style="margin: 0; font-size: 26px; color: #2e7d32;">Verify Your Email</h1>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td align="center" style="padding: 20px 40px 10px; color: #444; font-size: 16px;">
                <p style="margin: 0 0 10px;">Hi ${values.name},</p>
                <p style="margin: 0 0 20px;">
                  To continue booking your ride, please enter the OTP below to verify your email address.
                </p>
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td align="center" style="padding: 10px 40px 30px;">
                <div style="background-color: #e8f5e9; color: #1b5e20; font-size: 28px; font-weight: bold; padding: 18px 36px; border-radius: 8px; letter-spacing: 4px;">
                ${values.otp}
                </div>
                <p style="color: #777; font-size: 14px; margin-top: 15px;">This OTP is valid for 3 minutes.</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding: 20px; font-size: 12px; color: #aaa; background-color: #f9f9f9;">
                &copy; MoviCare.com• All rights reserved
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="margin: 0; padding: 0; background-color: #f6fdf8; font-family: 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6fdf8; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 18px rgba(0,0,0,0.06);">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding: 40px 0 10px;">
              <img src="https://movicare-dashboard.netlify.app/logo.png" alt="MoviCare Logo" width="120" style="display:block;" />
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td align="center" style="padding: 0 40px;">
              <h1 style="margin: 0; font-size: 26px; color: #2e7d32;">Reset Your Password</h1>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td align="center" style="padding: 20px 40px 10px; color: #444; font-size: 16px;">
              <p style="margin: 0 0 20px;">
                We received a request to reset your password. Please use the OTP below to proceed. If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding: 10px 40px 30px;">
              <div style="background-color: #e8f5e9; color: #1b5e20; font-size: 28px; font-weight: bold; padding: 18px 36px; border-radius: 8px; letter-spacing: 4px;">
                ${values.otp}
              </div>
              <p style="color: #777; font-size: 14px; margin-top: 15px;">This OTP is valid for 3 minutes.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px; font-size: 12px; color: #aaa; background-color: #f9f9f9;">
              &copy; MoviCare.com • All rights reserved
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
`,
  };
  return data;
};

export const emailTemplate = {
  createAccount,
  resetPassword,
};
