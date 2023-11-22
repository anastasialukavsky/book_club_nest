import axios from 'axios';

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export async function emailCheck(email: string) {
  try {
    const { data } = await axios.get(
      `${HTTP_ENDPOINT}/auth/verify-email/${email}`,
      { withCredentials: true },
    );

    if (data.message === true) return true;
    else return false;
    // return data;
  } catch (err) {
    console.error(err);
  }
}
