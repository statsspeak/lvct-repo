
import AfricasTalking from 'africastalking';

if (!process.env.AFRICASTALKING_API_KEY || !process.env.AFRICASTALKING_USERNAME) {
  throw new Error('Missing Africa\'s Talking credentials');
}

const africastalking = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME,
});

export default africastalking;