import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

//component functions declaration
function ProfileSidebar(propriedades) {  
  return (
    <Box as="aside">
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr/>
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
      
    </Box>
  )
}

function ProfileRelationsBox(properties) {
  return (
    <ProfileRelationsBoxWrapper>        
      <h2 className="smallTitle">
        {properties.title} ({properties.items.length})
      </h2>

      <ul>
        {properties.items.map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.html_url}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>  
  )
}

export default function Home(props) {
  /*local memory variables declaration*/
  const usuarioAleatorio = props.githubUser;
   
  const seguidores = [{
    login: 'ronenhamias',
    id: '1706296',
    avatar_url: 'https://avatars.githubusercontent.com/u/1706296?v=4',
    html_url: 'https://github.com/ronenhamias'
  }];
  
  //const comunidades = ['AluraKut'];
  const pessoasFavoritas = [    
    {
      id: '123456',
      title: 'juunegreiros'
    },
    {
      id: '123457',
      title: 'omariosouto'
    },
    {
      id: '123458',
      title: 'peas'
    },
    {
      id: '123459',
      title: 'rafaballerini'
    },
    {
      id: '123451',
      title: 'felipefialho'
    }   
  ];

  /*react state variables declaration*/
  const [comunidades, setComunidades] = React.useState([{}]);
  
  //Get data from Dato API
  React.useEffect(function(){
    fetch('https://graphql.datocms.com',{
    method: 'POST',
    headers: {
      'Authorization': 'c37502b06baf04ecc0676d0fde30c6',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body:JSON.stringify({"query" : `
        query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`
  })
  }).then(
    function(response){
      return response.json()
    }
  ).then(
    jsonResponse => setComunidades(jsonResponse.data.allCommunities)
  )    
  },[]);
  
  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer ?</h2>
            <form onSubmit={
                function handleCriaComunidade(e){
                  e.preventDefault();

                  const dadosForm = new FormData(e.target);

                  const comunidade = {
                    title: dadosForm.get('title'),
                    imageUrl: dadosForm.get('image'),
                    creatorSlug: 'efcjunior'
                  };

                  fetch('/api/comunidades', {
                    method:'POST',
                    headers: {
                      'Content-Type':'application/json',
                      'Accept': 'application/json'
                    },
                    body:JSON.stringify(comunidade)
                  }).then(async(response) => {
                    const comunidadeCadastrada =  await response.json();
                    console.log(comunidadeCadastrada);
                    setComunidades([...comunidades, comunidadeCadastrada.registroCriado]);
                  });                  
                }}>

              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade ?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade ?"
                  type="text"
                  />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                  type="text"
                  />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>          
        
        <ProfileRelationsBox title={'Seguidores'} items={seguidores}/>

        <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.id}`}>
                      <img src={`https://github.com/${itemAtual.title}.png`} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const userToken = nookies.get(context).USER_TOKEN;  
  console.log(userToken);
  const {githubUser}= jwt.decode(userToken);
  
  const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth',{
    headers:{
      Authorization: userToken
    }
  })
  .then((response) => response.json());
    

    if(!isAuthenticated) {
      return {
        redirect: {
          destination: '/login',
          permanent: false
        }
      }
    } 

    return {
      props: {githubUser: githubUser}, // will be passed to the page component as props
    }       
}