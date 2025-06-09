export async function checkPassword(input: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/check-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: input }),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error checking password:', error);
    return false;
  }
} 