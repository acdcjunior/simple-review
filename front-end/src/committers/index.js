const imgInterrogacao = require('../assets/question_mark.png')

const committers = {
  commiterLogado: undefined,
  committers: {
    'frost@walnutgaming.com': {email: 'frost@walnutgaming.com', nome: 'Frost Walnut', avatar_url: 'https://gitlab.com/uploads/user/avatar/201566/avatar.png'},
    'jagauthier@gmail.com': {email: 'jagauthier@gmail.com', nome: 'jagauthier@gmail.com', avatar_url: imgInterrogacao},
    'myntath@gmail.com': {email: 'myntath@gmail.com', nome: 'myntath@gmail.com', avatar_url: imgInterrogacao},
    'obihoernchende@gmail.com': {email: 'obihoernchende@gmail.com', nome: 'Obi Hoern Chende', avatar_url: imgInterrogacao},
    'oniltonmaciel@gmail.com': {email: 'oniltonmaciel@gmail.com', nome: 'Onilton Maciel', avatar_url: imgInterrogacao},
    'philpereboom@hotmail.com': {email: 'philpereboom@hotmail.com', nome: 'philpereboom@hotmail.com', avatar_url: imgInterrogacao},
    'sebastienvercammen@users.noreply.github.com': {email: 'sebastienvercammen@users.noreply.github.com', nome: 'Sebastien Ver Cammen Oliveira (SEBASTIEN)', avatar_url: 'https://secure.gravatar.com/avatar/9f618ce58de37c4d6b3b9be44fe99ccb?s=72&d=identicon'},
    'smulster@gmail.com': {email: 'smulster@gmail.com', nome: 'Smulster Silva Bob Nelson (SMULSTER)', avatar_url: 'https://gitlab.com/uploads/user/avatar/3585/corto-maltese-rect.jpg'},
    'thunderfox@thunderfox.nl': {email: 'thunderfox@thunderfox.nl', nome: 'Antônio C. de Carvalho Júnior (CARVALHOJ)', avatar_url: 'https://trello-avatars.s3.amazonaws.com/8ac310ff3a8e5410d2e5c5023beb2ee2/170.png'},
    'trentwilliamjones@gmail.com': {email: 'trentwilliamjones@gmail.com', nome: 'Trent William Jones', avatar_url: imgInterrogacao}
  },
  ok: [
    {'key': null, 'value': 1},
    {'key': 'frost@walnutgaming.com', 'value': 23},
    {'key': 'jagauthier@gmail.com', 'value': 2},
    {'key': 'myntath@gmail.com', 'value': 2},
    {'key': 'obihoernchende@gmail.com', 'value': 6},
    {'key': 'oniltonmaciel@gmail.com', 'value': 6},
    {'key': 'philpereboom@hotmail.com', 'value': 2},
    {'key': 'sebastienvercammen@users.noreply.github.com', 'value': 23},
    {'key': 'smulster@gmail.com', 'value': 1},
    {'key': 'thunderfox@thunderfox.nl', 'value': 3},
    {'key': 'trentwilliamjones@gmail.com', 'value': 1}
  ]
}
committers.get = (email) => {
  if (committers.committers[email]) {
    return committers.committers[email]
  }
  return {email: email, nome: email, avatar_url: imgInterrogacao}
}

committers.testLogin = (component) => {
  if (!committers.commiterLogado) {
    let cookieLogado = component.$cookie.get('commiterLogado')
    if (cookieLogado) {
      committers.commiterLogado = committers.committers[JSON.parse(cookieLogado).email]
    } else {
      component.$router.go('/login')
      return true
    }
  }
}

export default committers
