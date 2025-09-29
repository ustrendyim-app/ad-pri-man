export default function Privacy() {
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
      <h1 style={{ color: '#000000', marginBottom: '30px', fontSize: '32px', fontWeight: 'bold' }}>Privacy Policy</h1>
      
      <div style={{ color: '#666666', fontSize: '14px', marginBottom: '20px' }}>
        Last updated: {new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Information We Collect</h2>
        <p style={{ marginBottom: '16px' }}>
          Admin Price Sort Edit collects only the minimum information necessary to provide our services:
        </p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li>Shop domain and basic store information</li>
          <li>Product and pricing data you choose to modify</li>
          <li>Usage analytics to improve app performance</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>How We Use Your Information</h2>
        <p style={{ marginBottom: '16px' }}>We use collected information to:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li>Provide and maintain our price editing services</li>
          <li>Process your product price updates</li>
          <li>Improve app functionality and user experience</li>
          <li>Provide customer support when requested</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Data Security</h2>
        <p style={{ marginBottom: '16px' }}>
          We implement appropriate security measures to protect your information against unauthorized access, 
          alteration, disclosure, or destruction. All data transmission is encrypted using industry-standard protocols.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Data Retention</h2>
        <p style={{ marginBottom: '16px' }}>
          We retain your data only as long as necessary to provide our services. When you uninstall the app, 
          all associated data is automatically deleted from our systems.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Third-Party Services</h2>
        <p style={{ marginBottom: '16px' }}>
          Our app integrates with Shopify's API to provide pricing functionality. We do not share your data 
          with any other third-party services without your explicit consent.
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Your Rights</h2>
        <p style={{ marginBottom: '16px' }}>You have the right to:</p>
        <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Uninstall the app at any time</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Contact Us</h2>
        <p style={{ marginBottom: '16px' }}>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p style={{ marginBottom: '8px' }}>
          <strong>Email:</strong> info@webtorn.com
        </p>
        <p style={{ marginBottom: '16px' }}>
          <strong>Website:</strong> https://ad-pri-man.vercel.app
        </p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#000000', fontSize: '24px', marginBottom: '16px', fontWeight: 'bold' }}>Changes to This Policy</h2>
        <p style={{ marginBottom: '16px' }}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last updated" date.
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