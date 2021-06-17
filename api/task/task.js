const axios = require('axios');
const moment = require('moment');

module.exports = {
  taskApi: async (req, res) => {
    // const brandId = req.params.brandId;
    
    const token = await getTheToken();
    
    if (token) {

      const apiUrl = `https://challenge.motorway.co.uk/api/visits?token=${token}&page=`,
      pages = await getNumOfPagesArr(token),
      myArrayOfData = pages.map(function (page) {
          return {webAddress: apiUrl + page};
      });

      promises = [];
      myArrayOfData.forEach(function (singleElement) {
          const myUrl = singleElement.webAddress;
          promises.push(axios.get(myUrl));
      });

      Promise.all(promises).then(function (results) {
        results.forEach(function (response) {

          try {

          let newDates = response.data.data.filter(obj => {
            let date = moment(obj.date);
            let day = date.day();
            let isWeekend = day === 6 || day === 0;
            let isSameDay = moment().isSame(date, 'day')
            return !isWeekend && !isSameDay;
          });


          console.log(newDates);

          
          } catch(err) {
            console.log(err);
          }


        });
    });


    } else {
      res.status(500).send({ error: "boo:(" });
    }
    
  }
}

async function getNumOfPagesArr(token) {
  try {
    const response = await axios.get(`https://challenge.motorway.co.uk/api/visits?page=1&token=${token}`)
    const noOfRecords = 15;
    const totalRecords = response.data.total;
    const noOfPages = parseInt(totalRecords)/noOfRecords;

    var page_array = [];
    for (var i = 1; i <= noOfPages; i++) {
      page_array.push(i);
    }

    return page_array;
  } catch (error) {
    console.log(error);
  }
}

async function getTheToken() {
  try {
    const response = await axios.get('https://challenge.motorway.co.uk/api/login')
    return response.data.token;
  } catch (error) {
    console.log(error);
  }
}