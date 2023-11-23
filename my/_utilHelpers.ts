import axios from 'axios';

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function emailCheck(email: string): Promise<boolean> {
  try {
    const { data } = await axios.get(
      `${HTTP_ENDPOINT}/auth/verify-email/${email}`,
      { withCredentials: true },
    );
    console.log(data);
    if (data.message) return true;
    else return false;
  } catch (err) {
    return false;
    console.error(err);
  }
}
