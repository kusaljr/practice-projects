$(".btn-open").click(function(){
    $("#pack-opened").toggleClass("open");

    function getRandom(total){
        var random = Math.floor(Math.random() * total);
        return random
    }

    document.getElementById("open").style.visibility = "hidden"

    setTimeout(function(){
        document.getElementById("close").style.visibility = "visible"
       }, 3000);


    const pokemon = ['swanna','lombre','charmeleon','raichu', 'charizard', 'Granbull', 'shaymin', 'cosmog', 'greninja', 'swoobat', 'wurmple', 'hitmontop', 'sewaddle', 'cramorant', 'meganium','ledyba','skiploom', 'mudsdale','seviper', 'keldeo', 'patrat', 'crawdaunt', 'koffing', 'bulbasur', 'ivysaur', 'venusaur','charmander','squirtle','wartotle','blastoise','caterpie','metapod','butterfree','weedle','kakuna','beedrill','pidgey','pidgeitto','pidgeot','rattata','raticate','spearow','fearow','ekans','arbok','pikachu','sandshrew','sandslash','nidorina','nidoqueen','nidoking','vulpix','ninetales','jigglypuff','wigglytuff','zubat','globat','paras','parasect','meowth','persian','golduck','mankey','primeape','growlithe','arcanine','poliwrath','abra','kadabra','alakazam','machoke','machamp','tentacruel','golem','ponyta','rapidash','magneton']

    const cardElements = document.querySelector(".gold")
    const cardElements2 = document.querySelector(".silver")
    const cardElements3 = document.querySelector(".card-04")

    async function getPokemon(name){
        const response = await fetch(`https://api.pokemontcg.io/v1/cards?name=${name}`)
        const json = await response.json()
        var length = json.cards.length
        
        var url = json.cards[getRandom(length)].imageUrl
        return url
    }
    
    
    const image = document.createElement('img');
    getPokemon(pokemon[getRandom(pokemon.length)]).then((result)=>{
        image.src = result
    })    
    cardElements.append(image)  

    const image2 = document.createElement('img');
    getPokemon(pokemon[getRandom(pokemon.length)]).then((result)=>{
        image2.src = result
    })    
    cardElements2.append(image2)

    const image3 = document.createElement('img');
    getPokemon(pokemon[getRandom(pokemon.length)]).then((result)=>{
        image3.src = result
    })
    cardElements3.append(image3)
    
    

});

