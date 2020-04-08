function init() {

  // global variables to store api data in
  let data,
    races;

  // self invoking function which gets the data from api
  (function() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://ergast.com/api/f1/drivers/grosjean/results.json?limit=400', true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        data = JSON.parse(this.response);
        races = data.MRData.RaceTable.Races;
        handleData();
      } else {
        // We reached our target server, but it returned an error
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
    };

    request.send();

  })();

  // function which fires other functions that use api data
  function handleData() {
    calcLastCrash();

    setWallpaper();

    animateCSS('#ellipse', 'bounceInUp', function() {
      animateCSS('#middle-text', 'heartBeat');
      document.querySelector('#middle-text').style.opacity = '1';
    });

    setTimeout(function() {
      document.querySelector('#ellipse').style.display = 'flex';
    }, 900);

  }

  // set random wallpaper image
  function setWallpaper() {
    const bgArray = [
      "img/1.jpg",
      "img/2.jpg",
      "img/3.jpg",
      "img/4.jpg",
      "img/5.jpg",
      "img/6.jpg",
      "img/7.jpg",
      "img/8.jpg"
    ]

    function randomIndex() {
      let random = Math.floor(Math.random() * bgArray.length);
      return random;
    }

    const randomImgUrl = bgArray[randomIndex()];

    let img = document.createElement("img");
    img.src = 'assets/' + randomImgUrl;

    img.addEventListener('load', loadBgImg());

    function loadBgImg() {
      setTimeout(function() {

      document.querySelector("#bg-element").style.backgroundImage = 'url(assets/' + randomImgUrl + ')';
      document.querySelector('#bg-element').style.display = 'initial';

        document.querySelector('#bg-element').style.opacity = 1;

        setTimeout(function() {
          const preloaderContainer = document.querySelector('#preloader-container');
          preloaderContainer.parentNode.removeChild(preloaderContainer);
          img = null;
        }, 500);


}, 400);
    }
  }

  // animate text on hover
  document.querySelector('#ellipse').addEventListener('mouseenter', function() {
    animateCSS('#middle-text', 'heartBeat');
  });

  let lastCrash;

  // calculate the days since Grosjean last crashed
  function calcLastCrash() {
    for (let i = races.length - 1; i >= 0; i--) {
      const raceStatus = races[i].Results[0].status.toLowerCase();
      if (raceStatus.includes("accident") || raceStatus.includes("collision")) {
        lastCrash = i;
        break;
      }
    }
    document.querySelector('#amount-span').innerHTML = racesSinceCrash();
    document.querySelector('#races-span').innerHTML = singularOrPlural();
  }

  // calculate the amount of races without a crash
  function racesSinceCrash() {
    const amount = races.length - lastCrash - 1;
    return amount;
  }

  function singularOrPlural() {
    if (racesSinceCrash() == 1) {
      return 'race';
    } else {
      return 'races';
    }
  }


  // function to fire animate.css animations
  function animateCSS(element, animationName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)

    function handleAnimationEnd() {
      node.classList.remove('animated', animationName)
      node.removeEventListener('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
    }

    node.addEventListener('animationend', handleAnimationEnd)
  }

}

window.onload = init;
