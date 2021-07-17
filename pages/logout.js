import nookies from 'nookies';

export default function LogoutPage() {
 

}

export async function getServerSideProps(context) {
    nookies.destroy(context, 'USER_TOKEN', {
        path: '/'
    });

    return {        
        redirect: {
            destination: '/login',
            permanent: false
        }
    }
}