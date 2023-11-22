import axios from 'axios';

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function emailCheck(email: string): Promise<boolean> {
  try {
    const { data } = await axios.get(
      `${HTTP_ENDPOINT}/auth/verify-email/${email}`,
      { withCredentials: true },
    );

    if (data.message === true) return true;
    else return false;
  } catch (err) {
    console.error(err);
    return false; //default return
  }
}
