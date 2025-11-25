import { getValue } from '@/lib/redis-utils'

export default async function TermsAcceptancesPage() {
  let acceptances: any[] = []
  
  try {
    // Try to get any terms acceptance data
    const testData = await getValue('terms_acceptance:test')
    if (testData) {
      acceptances = [{
        key: 'terms_acceptance:test',
        ...testData
      }]
    }
  } catch (error) {
    console.error('Error fetching acceptances:', error)
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Terms of Service Acceptances
      </h1>
      
      {acceptances.length === 0 ? (
        <div style={{ 
          backgroundColor: '#fef3cd', 
          border: '1px solid #f59e0b', 
          padding: '1rem',
          borderRadius: '0.5rem'
        }}>
          <p>No acceptance records found.</p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Make sure users are accepting terms and data is being stored with keys like `terms_acceptance:user_id`
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {acceptances.map((acceptance, index) => (
            <div key={index} style={{ 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.5rem', 
              padding: '1rem',
              backgroundColor: 'white',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                Key: {acceptance.key}
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}>
                <div><strong>Accepted:</strong> {acceptance.accepted?.toString()}</div>
                <div><strong>Timestamp:</strong> {acceptance.timestamp}</div>
                <div><strong>Version:</strong> {acceptance.termsVersion}</div>
                {acceptance.ipAddress && (
                  <div><strong>IP:</strong> {acceptance.ipAddress}</div>
                )}
                {acceptance.userId && (
                  <div><strong>User ID:</strong> {acceptance.userId}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/"
          style={{ color: '#3b82f6', fontWeight: '500' }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  )
}