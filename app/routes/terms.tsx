export default function Terms() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      lineHeight: '1.6',
      backgroundColor: '#ffffff',
      color: '#000000',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#000000', marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>Terms of Service</h1>
      
      <div style={{ color: '#666666', fontSize: '14px', marginBottom: '20px' }}>
        Last updated: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Acceptance of Terms</h2>
        <p style={{ marginBottom: '16px' }}>
          By installing and using Admin Price Sort Edit ("the App"), you agree to be bound by these Terms of Service. 
          If you do not agree to these terms, please do not use the App.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Description of Service</h2>
        <p style={{ marginBottom: '16px' }}>
          Admin Price Sort Edit is a Shopify application that allows store owners to:
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li>Edit product and variant prices in real-time</li>
          <li>Sort and filter products by various criteria</li>
          <li>Manage product status (active/inactive)</li>
          <li>View products with advanced pagination options</li>
          <li>Access multi-language interface support</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>User Responsibilities</h2>
        <p style={{ marginBottom: '16px' }}>You agree to:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li>Use the App in compliance with all applicable laws and regulations</li>
          <li>Ensure you have proper authorization to modify pricing in your store</li>
          <li>Backup your data before making bulk price changes</li>
          <li>Not attempt to reverse engineer, modify, or distribute the App</li>
          <li>Not use the App for any illegal or unauthorized purposes</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Data and Privacy</h2>
        <p style={{ marginBottom: '16px' }}>
          The App accesses and processes your store's product data to provide its services. We are committed to 
          protecting your privacy and handle your data in accordance with our Privacy Policy. You retain ownership 
          of all your store data.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Pricing and Payment</h2>
        <p style={{ marginBottom: '16px' }}>
          The App offers multiple pricing tiers:
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li><strong>Free Plan:</strong> Up to 100 products with basic features</li>
          <li><strong>Pro Plan:</strong> $9.99/month for unlimited products</li>
          <li><strong>Enterprise:</strong> $29.99/month with advanced features</li>
        </ul>
        <p style={{ marginBottom: '16px' }}>
          All payments are processed through Shopify's billing system. Fees are billed monthly and are non-refundable.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Service Availability</h2>
        <p style={{ marginBottom: '16px' }}>
          We strive to maintain 99.9% uptime, but cannot guarantee uninterrupted service. We reserve the right to 
          perform maintenance that may temporarily affect service availability. We will provide advance notice when possible.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Limitation of Liability</h2>
        <p style={{ marginBottom: '16px' }}>
          The App is provided "as is" without warranties of any kind. We are not liable for any damages arising from:
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li>Use or inability to use the App</li>
          <li>Data loss or corruption</li>
          <li>Business interruption</li>
          <li>Errors in pricing updates</li>
        </ul>
        <p style={{ marginBottom: '16px' }}>
          You are responsible for backing up your data and verifying any price changes before implementation.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Termination</h2>
        <p style={{ marginBottom: '16px' }}>
          You may terminate your use of the App at any time by uninstalling it from your Shopify store. 
          We reserve the right to terminate or suspend access to the App for violations of these terms.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Support</h2>
        <p style={{ marginBottom: '16px' }}>
          For technical support or questions about the App, please contact us at:
        </p>
        <p style={{ marginBottom: '8px' }}>
          <strong>Email:</strong> info@webtorn.com
        </p>
        <p style={{ marginBottom: '16px' }}>
          <strong>Response time:</strong> Within 24 hours during business days
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Changes to Terms</h2>
        <p style={{ marginBottom: '16px' }}>
          We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately 
          upon posting. Your continued use of the App after changes constitutes acceptance of the new terms.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Governing Law</h2>
        <p style={{ marginBottom: '16px' }}>
          These Terms of Service are governed by and construed in accordance with the laws of [Your Jurisdiction]. 
          Any disputes shall be resolved through binding arbitration.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Contact Information</h2>
        <p style={{ marginBottom: '16px' }}>
          For questions about these Terms of Service, please contact us at:
        </p>
        <p style={{ marginBottom: '8px' }}>
          <strong>Email:</strong> info@webtorn.com
        </p>
        <p style={{ marginBottom: '16px' }}>
          <strong>Website:</strong> https://ad-pri-man.vercel.app
        </p>
      </section>

      <div style={{ 
        borderTop: '1px solid #cccccc',
        paddingTop: '20px', 
        fontSize: '14px', 
        color: '#666666',
        textAlign: 'center'
      }}>
        © {new Date().getFullYear()} Admin Price Sort Edit. All rights reserved.
      </div>
    </div>
  );
}
