// selectors
document.querySelector('.search-input').addEventListener('keyup', getMember);
const display = document.querySelector('.display');
let serverList = document.getElementById('server-list');
let defaultServer = document.createElement('option');
defaultServer.text = 'Select a Realm';
serverList.add(defaultServer);
serverList.selectedIndex = 0;

// Fetch list of US server and populate the Server Select list
fetch(
  `https://us.api.battle.net/data/wow/realm/?namespace=dynamic-us&locale=en_US&access_token=n67jgcjc3sgq8anbqw9haccw`
)
  .then(res => res.json())
  .then(realmIndex => {
    let option;
    // create a list of realms from realm data
    let realms = realmIndex.realms;
    // for each realm add an option the serverList dropdown
    realms.forEach(realm => {
      option = document.createElement('option');
      option.text = realm.name;
      option.value = realm.slug;
      serverList.add(option);
    });
  })
  .catch(function(err) {
    console.log('Fetch Error -', err);
  });

function getMember(e) {
  let itemList = '';
  let gearRight = '';
  let gearLeft = '';
  let thumbnail = '';
  let server = serverList.options[serverList.selectedIndex].text;
  let guild = document.querySelector('.guild-input').value;

  fetch(
    `https://us.api.battle.net/wow/guild/${server}/${guild}?fields=members&locale=en_US&apikey=yku5p7jc26x5pnnj9qy73ufdfh48pgqj`
  )
    .then(res => res.json())
    .then(guild => {
      const members = guild.members;
      const input = e.target.value;

      members.forEach(member => {
        const character = member.character;
        const memberName = member.character.name;
        if (input === memberName) {
          fetch(
            `https://us.api.battle.net/wow/character/${server}/${input}?fields=items&locale=en_US&apikey=yku5p7jc26x5pnnj9qy73ufdfh48pgqj
            `
          )
            .then(res => res.json())
            .then(character => {
              const name = character.name;
              const items = character.items;

              thumbnail += `
                <h3>${name}</h3>
                <h5><strong>Avg iLvl : </strong>${items.averageItemLevel}</h5>
                <img src="http://render-us.worldofwarcraft.com/character/${
                  character.thumbnail
                }" alt="thumbail of character"/>
              `;
              document.querySelector('.thumbnail').innerHTML = thumbnail;

              gearLeft += `
                <li><strong>Helm : </strong>${items.head.name}</li>
                <li><strong>Neck : </strong>${items.neck.name}</li>
                <li><strong>Shoulder : </strong>${items.shoulder.name}</li>
                <li><strong>Back : </strong>${items.back.name}</li>
                <li><strong>Chest : </strong>${items.chest.name}</li>
                <li><strong>Wrist : </strong>${items.wrist.name}</li>
                <li><strong>MH : </strong>${items.mainHand.name}</li>
              `;
              document.querySelector('.gear-left').innerHTML = gearLeft;

              gearRight += `
                <li><strong>Hands : </strong>${items.hands.name}</li>
                <li><strong>Waist : </strong>${items.waist.name}</li>
                <li><strong>Legs : </strong>${items.legs.name}</li>
                <li><strong>Feet : </strong>${items.feet.name}</li>
                <li><strong>Ring 1 : </strong>${items.finger1.name}</li>
                <li><strong>Ring 2 : </strong>${items.finger2.name}</li>
                <li><strong>Trinket 1 : </strong>${items.trinket1.name}</li>
                <li><strong>Trinket 2 : </strong>${items.trinket2.name}</li>
              `;
              document.querySelector('.gear-right').innerHTML = gearRight;
            })
            .then((document.querySelector('.search-input').value = ''));
        } else {
          itemList = '';
          gearRight = '';
          gearLeft = '';
          thumbnail = '';
        }
      });
    });
}
