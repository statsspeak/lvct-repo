
import AfricasTalking from 'africastalking';

if (!process.env.AT_API_KEY || !process.env.AT_USERNAME) {
  throw new Error('Missing Africa\'s Talking credentials');
}

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

export default africastalking;