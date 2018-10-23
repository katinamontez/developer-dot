var fixApiRefNav = function() {
    if ($('#the-nav li').length >= 22) {
        $('#the-nav').data('offset-bottom', '160');
    }
};

var fixDropDownMenuLargePosition = function() {
    setTimeout(function() {
        $('.dropdown-large').each(function() {
            var left = $(this).position().left;

            $(this).find('.dropdown-menu-large').css('left', left);
        });
    }, 100);
};

function getCompareDate() {
  var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('');
}

/************************************************************************
**   SAMPLE DATA Functions: Build the sample data in the correct language
**   Langauges: JSON, C#, PHP, Python, (Ruby, Java, JavaScript)
************************************************************************/



// TODO: function lineBuilder() {
//     let lineNum = 1;
//     const allProducts = $('input[type=checkbox][name=product]:checked');
//     allProducts.each(function () {
//         const taxCode = $(this).val();
//         const amount = $('#' + $(this).attr('id') + '-amount').val();
//         const description = $(this).attr('description');
//         lines += `{
//             'amount': '${amount}',
//             'description': '${description}',
//             'number': '${lineNum}',
//             'taxCode': '${taxCode}'
//         }`;

//         if (lineNum != allProducts.length) {
//             lines += ',\n        ';
//         }

//         lineNum++
//     });
// }

// TODO: function addressBuilder() {
//     let address;
//     let lines = ``;
//     const shipToAddress = shipToChecked();

//     if (shipToAddress) {
//         const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
//         const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');

//         address = ``;
//     } else {
//         const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

//         address = ``;
//     }

//     const sampleData = ;

//     return sampleData
// }

// HELPER: check if shipTo address is selected
function shipToChecked() {
    const checked = $('input[type=radio][name=srcAddress]:checked').length > 0;
    return checked;
}

// HELPER: for jsonSampleData, build shipTo/From objs
function makeAddressObj(addressName){
    const address = $(`input[type=radio][name=${addressName}]:checked`).val().split(',');
    const addressObj = {
        "line1": address[0],
        "city": address[1],
        "region": address[2],
        "country": address[3],
        "postalCode": address[4],
    }
    return addressObj;
}

function jsonSampleData() {
    // check if there is a shipTo address selected
    const shipToAddress = shipToChecked();
    const address = makeAddressObj('address');
    let sampleData;

    if(shipToAddress) {
        const srcAddress = makeAddressObj('srcAddress');

        sampleData = {
            "lines": [],
            "type": "SalesOrder",
            "companyCode": "DEMOPAGE",
            "date": "2018-09-05",
            "customerCode": "ABC",
            "addresses": {
                "shipTo": address,
                "shipFrom": srcAddress,
            }
        };
    }
    else {
        sampleData = {
            "lines": [],
            "type": "SalesOrder",
            "companyCode": "DEMOPAGE",
            "date": "2018-09-05",
            "customerCode": "ABC",
            "addresses": {
                "singleLocation": address,
            }
        };
    }

    // Loop through all the checked products and add one line for each
    var lineNum = 1;
    $('input[type=checkbox][name=product]:checked').each(function () {
        // Find amount
        sampleData.lines.push({
            "number": lineNum++,
            "amount": $('#' + $(this).attr('id') + '-amount').val(),
            "taxCode": $(this).val(),
            "description": $(this).attr('description')
        });
    });

    return sampleData;
}

function cSharpSampleData() {
    let lines = '';
    let address;
    const shipToAddress = shipToChecked();
    
    // gather all product info and make into SDK friendly form
    let lineNum = 1;
    const allProducts = $('input[type=checkbox][name=product]:checked');
    allProducts.each(function () {
        // Find amount
        const taxCode = $(this).val();
        const amount = $('#' + $(this).attr('id') + '-amount').val();
        lines += `new LineItemModel() 
        {
            number = "${lineNum}",
            quantity = 1,
            amount = ${amount},
            taxCode = "${taxCode}"
        }`;
        
        if (lineNum != allProducts.length) {
            lines += ',\n        ';
        }
        lineNum++;
    });

    // check if shipFrom/To addresses
    if(shipToAddress) {
        const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
        const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');
        
        // build C# req for multiple addresses
        address = `shipFrom = new AddressLocationInfo()
        {
            line1 = "${shipFrom[0]}",
            city = "${shipFrom[1]}",
            region = "${shipFrom[2]}",
            country = "${shipFrom[4]}",
            postalCode = "${shipFrom[3]}"
        },
        shipTo = new AddressLocationInfo()
        {
            line1 = "${shipTo[0]}",
            city = "${shipTo[1]}",
            region = "${shipTo[2]}",
            country = "${shipTo[4]}",
            postalCode = "${shipTo[3]}"
        }`;
    } else {
        const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

        // build C# req for single location
        address = `singleLocation = new AddressLocationInfo()
        {
            line1 = "${singleLocation[0]}",
            city = "${singleLocation[1]}",
            region = "${singleLocation[2]}",
            country = "${singleLocation[4]}",
            postalCode = "${singleLocation[3]}"
        }`;
    }

    // build sample data for c#
    const sampleData = `// Create AvaTaxClient
var client = new AvaTaxClient("MyTestApp", "1.0", Environment.MachineName, AvaTaxEnvironment.Sandbox).WithSecurity("MyUsername", "MyPassword");

// Setup transaction model
var createModel = new CreateTransactionModel()
{
    type = docType,
    companyCode = "DEMOPAGE",
    date = DateTime.Today,
    customerCode = "ABC",
    lines = new List<LineItemModel>() 
    {
        ${lines}
    },
    addresses = new AddressesModel() 
    {
        ${address}
    }
}

// Create transaction
var transaction = client.CreateTransaction(null, createModel);`;

    return sampleData;
}

function phpSampleData() {
    let lines = '';
    let address;
    const shipToAddress = shipToChecked();
    
    // gather all product info and make into PHP SDK friendly form
    let lineNum = 0;
    $('input[type=checkbox][name=product]:checked').each(function () {
        const taxCode = $(this).val();
        const amount = $('#' + $(this).attr('id') + '-amount').val();
        if (lineNum === 0) {
            lines += `->withLine(${amount}, ${lineNum++}, null, ${taxCode})`; 
        } else {
            lines += `\n    ->withLine(${amount}, ${lineNum++}, null, ${taxCode})`;
        }
    });

    // check if shipFrom/To addresses
    if(shipToAddress) {
        const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
        const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');
        
        // build PHP req for multiple addresses
        address = `->withAddress('ShipFrom', ${shipTo[0]}, null, null, ${shipTo[1]}, ${shipTo[2]}, ${shipTo[4]}, ${shipTo[3]})
->withAddress('ShipTo', ${shipFrom[0]}, null, null, ${shipFrom[1]}, ${shipFrom[2]}, ${shipFrom[4]}, ${shipFrom[3]})`;
    } else {
        const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

        // build PHP req for single location
        address = `withAddress('SingleLocation', ${singleLocation[0]}, null, null, ${singleLocation[1]}, ${singleLocation[2]}, ${singleLocation[4]}, ${singleLocation[3]})`;
    }

        // build sample data for PHP
    const sampleData = `// Create a new client
$client = new Avalara\AvaTaxClient('phpTestApp', '1.0', 'localhost', 'sandbox');
$client->withSecurity('myUsername', 'myPassword’);

// Create a simple transaction using the fluent transaction builder
$tb = new Avalara\\TransactionBuilder($client, “DEMOPAGE", Avalara\\DocumentType::C_SALESORDER, 'ABC');
$t = $tb->${address}
    ${lines}
    ->create();
    `;

    return sampleData
}

function curlSampleData() {
    const json = JSON.stringify(jsonSampleData(), null, 2)
    const sampleData = `-X POST
-H 'Accept: application/json'
-H 'Authorization: Basic aHR0cHdhdGNoOmY='
-H 'Content-Type: application/json'
--data '${json}'
https://sandbox-rest.avatax.com/api/v2/transactions/create
        `;
    
    return sampleData;
}

function pythonSampleData() {
    let lines = ``;
    let address;
    const shipToAddress = shipToChecked();
    
    // Loop through all the checked products and add one line for each
    let lineNum = 1;
    const allProducts = $('input[type=checkbox][name=product]:checked');
    allProducts.each(function () {
        const taxCode = $(this).val();
        const amount = $('#' + $(this).attr('id') + '-amount').val();
        const description = $(this).attr('description');
        lines += `{
            'amount': '${amount}',
            'description': '${description}',
            'number': '${lineNum}',
            'taxCode': '${taxCode}'
        }`;

        if (lineNum != allProducts.length) {
            lines += ',\n        ';
        }

        lineNum++
    });

    if (shipToAddress){
        const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
        const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');

        address = `'ShipFrom': {
            'city': '${shipFrom[1]}',
            'country': '${shipFrom[3]}',
            'line1': '${shipFrom[0]}',
            'postalCode': '${shipFrom[4]}',
            'region': '${shipFrom[2]}'
        },
        'ShipTo': {
            'city': '${shipTo[1]}',
            'country': '${shipTo[3]}',
            'line1': '${shipTo[0]}',
            'postalCode': '${shipTo[4]}',
            'region': '${shipTo[2]}'
        },
        `;
    } else {
        const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

        address = `'SingleLocation': {
            'city': '${singleLocation[1]}',
            'country': '${singleLocation[3]}',
            'line1': '${singleLocation[0]}',
            'postalCode': '${singleLocation[4]}',
            'region': '${singleLocation[2]}'
        }`;
    }
    
    const sampleData = `#Create a new AvaTaxClient object
    client = AvataxClient('my test app',
    'ver 0.0',
    'my test machine',
    'sandbox')

#Add your credentials
client = client.add_credentials('USERNAME/ACCOUNT_ID', 'PASSWORD/LICENSE_KEY')

#Build your tax document
tax_document = {
    'addresses': {
        ${address}
    },
    'companyCode': 'DEMO PAGE',
    'customerCode': 'ABC',
    'date': '2017-04-12',
    'lines': [
        ${lines}
    ],
    'type': 'SalesOrder'
}

#Create transaction
transaction_response = client.create_transaction(tax_document)
print(transaction_response.text())`;
    
    return sampleData;
}

function rubySampleData() {
    let address;
    let lines = ``;
    const shipToAddress = shipToChecked();

    // Loop through all the checked products and add one line for each
    let lineNum = 1;
    const allProducts = $('input[type=checkbox][name=product]:checked');
    allProducts.each(function () {
        const taxCode = $(this).val();
        const amount = $('#' + $(this).attr('id') + '-amount').val();
        const description = $(this).attr('description');
        lines += `{
            amount: "${amount}",
            description: "${description}",
            number: "${lineNum}",
            taxCode: "${taxCode}"
        }`;

        if (lineNum != allProducts.length) {
            lines += ',\n        ';
        }

        lineNum++
    });    

    if (shipToAddress) {
        const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
        const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');

        address = `ShipFrom: {
            line1: "${shipFrom[0]}",
            city: "${shipFrom[1]}",
            region: "${shipFrom[2]}",
            country: "${shipFrom[3]}",
            postalCode: "${shipFrom[4]}"
        },
        ShipTo: {
            line1: "${shipTo[0]}",
            city: "${shipTo[1]}",
            region: "${shipTo[2]}",
            country: "${shipTo[3]}",
            postalCode: "${shipTo[4]}"
        }`;
    } else {
        const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

        address = `SingleLocation: {
            line1: "${singleLocation[0]}",
            city: "${singleLocation[1]}",
            region: "${singleLocation[2]}",
            country: "${singleLocation[3]}",
            postalCode: "${singleLocation[4]}"
        }`;
    }

    const sampleData = `credentials = YAML.load_file(File.expand_path('../credentials.yaml', __FILE__))

AvaTax.configure do |config|
    begin
    credentials = YAML.load_file(File.expand_path('../credentials.yaml', __FILE__))
    config.endpoint = credentials['endpoint']
    config.username = credentials['username']
    config.password = credentials['password']
    rescue
    config.endpoint = 'https://sandbox-rest.avatax.com'
    config.username = ENV['SANDBOX_USERNAME']
    config.password = ENV['SANDBOX_PASSWORD']
    end
end

@client = AvaTax::Client.new(:logger => true)

createTransactionModel = {
    type: 'SalesInvoice',
    companyCode: '12670',
    date: '2017-06-05',
    customerCode: 'ABC',
    addresses: {
       ${address} 
    },
    lines: [
        ${lines}
    ]
}

transaction = @client.create_transaction(createTransactionModel)`;

    return sampleData;
}

//TODO: Java
function javaSampleData() {
    let lines = ``;
    let address;
    const shipToAddress = shipToChecked();
    
    if (shipToAddress) {
        const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
        const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');

        address = `.withAddress(TransactionAddressType.ShipTo, ${shipTo[0]}, null, null, ${shipTo[1]}, ${shipTo[2]}, ${shipTo[4]}, ${shipTo[3]})
        .withAddress(TransactionAddressType.ShipFrom, ${shipFrom[0]}, null, null, ${shipFrom[1]}, ${shipFrom[2]}, ${shipFrom[4]}, ${shipFrom[3]})`;

    } else {
        const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

        address = `.withAddress(TransactionAddressType.SingleLocation, ${singleLocation[0]}, null, null, ${singleLocation[1]}, ${singleLocation[2]}, ${singleLocation[4]}, ${singleLocation[3]})`;
    }

    const sampleData = `//creates our AvaTaxClient
AvaTaxClient client = new AvaTaxClient("Test", "1.0", "localhost", AvaTaxEnvironment.Sandbox)
    .withSecurity("MyUsername", "MyPassword");

// build and create transaction
TransactionModel transaction = new TransactionBuilder(client, "DEFAULT", DocumentType.SalesInvoice, "ABC")
    ${address}
    ${lines}
    .Create();`;

    return sampleData
}

//TODO: JS
function javascriptSampleData() {
    let address;
    let lines = ``;
    const shipToAddress = shipToChecked();

    if (shipToAddress) {
        const shipTo = $('input[type=radio][name=srcAddress]:checked').val().split(',');
        const shipFrom = $('input[type=radio][name=address]:checked').val().split(',');

        address = `ShipFrom: {
            line1: '${shipFrom[0]}',
            city: '${shipFrom[1]}',
            region: '${shipFrom[2]}',
            country: '${shipFrom[3]}',
            postalCode: '${shipFrom[4]}'
        },
        ShipTo: {
            line1: '${shipTo[0]}',
            city: '${shipTo[1]}',
            region: '${shipTo[2]}',
            country: '${shipTo[3]}',
            postalCode: '${shipTo[4]}'
        }`;
    } else {
        const singleLocation = $('input[type=radio][name=address]:checked').val().split(',');

        address = `SingleLocation: {
            line1: '${singleLocation[0]}',
            city: '${singleLocation[1]}',
            region: '${singleLocation[2]}',
            country: '${singleLocation[3]}',
            postalCode: '${singleLocation[4]}'
        }`;
    }

    const sampleData = `const config = {
    appName: 'your-app',
    appVersion: '1.0',
    environment: 'sandbox',
    machineName: 'your-machine-name'
};
    
const creds = {
    username: '<your-username>',
    password: '<your-password>'
};
    
var client = new Avatax(config).withSecurity(creds);

const taxDocument = {
    type: 'SalesOrder',
    companyCode: 'abc123',
    date: '2017-04-12',
    customerCode: 'ABC',
    addresses: {
        ${address}
    },
    lines: [
        ${lines}
    ],
}
    
return client.createTransaction({ model: taxDocument })
    .then(result => {
        // response tax document
        console.log(result);
    });`;

    return sampleData
}

//
// MAIN Sample Data function: populates request console
//
function fillWithSampleData() {
    const noAddress = $('input[type=radio][name=address]:checked').length === 0;

    if (noAddress) {
        return;
    }
    
    const reqType = $('#req-type').val();
    let sampleData;

    switch (reqType) {
        case 'cURL':
            sampleData = curlSampleData();
            break;
        case 'C#':
            sampleData = cSharpSampleData();
            break;
        case 'PHP':
            sampleData = phpSampleData(); 
            break;
        case 'Python':
            sampleData = pythonSampleData();
            break;
        case 'Ruby':
            sampleData = rubySampleData();
            break;
        case 'Java':
            sampleData = javaSampleData();
            break;
        case 'JS':
            sampleData = javascriptSampleData();
            break;
        case 'JSON':
            sampleData = JSON.stringify(jsonSampleData(), null, 2);
            break;
        default:
            sampleData = '{ }';
            break;
    }

    $('#demo-console-input').empty().text(sampleData);
};
/***************** END SAMPLE DATA Functions ****************************/


/************************************************************************
**   INFOBOX Functions: Build infobox on map
************************************************************************/

// ...no other way to keep track of state...
let showInfobox = true;

function hideInfobox() {
    $(".demo-infobox").css('display', 'none');
    $(".demo-infobox").addClass('hidden');
    showInfobox = false
}

function buildInfoboxHTML(body) {
    const summaryArray = body.summary;

    let infoboxHTML;

    let countryTax = 0.00;
    let stateTax = 0.00; 
    let countyTax = 0.00; 
    let cityTax = 0.00; 
    let specialTax = 0.00;          
    
    if (summaryArray.length > 0) {
        for(let i = 0; i < summaryArray.length; i++) {
            const item = summaryArray[i];
            switch (item.jurisType) {
                case 'Country':
                    countryTax += item.taxCalculated;
                case 'State':
                    stateTax += item.taxCalculated;
                    break;
                case 'County':
                    countyTax += item.taxCalculated;
                    break;
                case 'City':
                    cityTax += item.taxCalculated;
                    break;
                case 'Special':
                    specialTax += item.taxCalculated;
                    break;
                default:
                    break;
            }
        };
    }
    
    infoboxHTML = `
        AvaTax's engine can calculate tax down to the roof-top level. In this case, 
        AvaTax returned a total tax of <span class="demo-tax-totals">$${body.totalTax.toFixed(2)}</span>, 
        which encompassed country <span class="demo-tax-totals">$${countryTax.toFixed(2)}</span>,
        state <span class="demo-tax-totals">$${stateTax.toFixed(2)}</span>, 
        county <span class="demo-tax-totals">$${countyTax.toFixed(2)}</span>, 
        city <span class="demo-tax-totals">$${cityTax.toFixed(2)}</span>,
        and special taxing districts <span class="demo-tax-totals">$${specialTax.toFixed(2)}</span>.
        Feel free to continue tinkering with the options to the left to test 
        the flexibility of the AvaTax API. Or, if you've seen enough, 
        <a href='https://developer.avalara.com/avatax/' target='_blank'>sign up for a 60-day API trial</a> 
        and production account.
    `;
    return infoboxHTML;
}
/***************** END INFOBOX Functions ********************************/


/************************************************************************
**  API REQUEST Functions: Send CreateTransaction request through proxy
************************************************************************/
const proxy = {
    "route": "https://xp0wfn7roi.execute-api.us-west-2.amazonaws.com/production/proxy",
    "key": {
        "name": "api-key",
        "location": "v2-devdot-keys/devdot-proxy-key"
    }
}

function ApiRequest() {
    // clear the console output/infobox and display loading-pulse
    $("#demo-console-output").empty();
    $(".loading-pulse").css('display', 'block');
    if (showInfobox) {
        $("#demo-infobox-text").empty();
        $("#demo-infobox-header").html('Calculating...');
    }
    
    const data = jsonSampleData();
    const [bucket, key] = proxy.key.location.split('/');

    const keyBucket = new AWS.S3({params: {Bucket: bucket, Key: key}});
    return keyBucket.makeUnauthenticatedRequest('getObject', {}).promise()
    .then((bucketRes) => {
        return fetch(proxy.route, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                apiKey: bucketRes.Body.toString(),
                method: 'POST',
                route: 'https://sandbox-rest.avatax.com/api/v2/transactions/create?$include=summaryOnly',
                queryString: {},
                pathParams:{},
                postBody: data
            })
        })
        .then((rawApiResponse) => {
            return rawApiResponse.json().then((body) => {
                $(".loading-pulse").css('display', 'none');
                $('#demo-console-output').text(JSON.stringify(body, null, 2));
                
                if (showInfobox) {
                    $("#demo-infobox-header").html('Result');
                    const infoboxHTML = buildInfoboxHTML(body);
                    $("#demo-infobox-text").html(infoboxHTML);
                }
               
                //TODO handle errors
                // $('#console-output').text("HTTP Error: " + body.status + "\n\n" + JSON.stringify(result, null, 2));

                return {
                    status: rawApiResponse.status.toString(),
                    statusMessage: rawApiResponse.statusText,
                    body: body,
                };
            });
        });
    })
}
/***************** END API REQUEST Functions ****************************/


/************************************************************************
**   GENERAL Demo Page Functions
************************************************************************/
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function accordionTrigger(currentElementId, nextElementId) {
    // get accordion elements
    var currentElement = document.getElementById(currentElementId);
    var nextElement = document.getElementById(nextElementId);

    // toggle active class on elements
    currentElement.classList.toggle("active");
    nextElement.classList.toggle("active");

    var panels = [currentElement.nextElementSibling, nextElement.nextElementSibling];

    // toggle display on panels
    panels.forEach(panel => {
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    })

}
/***************** END GENERAL Functions *******************************/


$(document).ready(function() {
    fixApiRefNav();
    fixDropDownMenuLargePosition();

    var sections = document.getElementsByClassName("accordion");
    for (let i = 0; i < sections.length; i++) {
        sections[i].addEventListener("click", function() {
            // Toggle between adding and removing the "active" class,
            // to highlight the button that controls the panel
            this.classList.toggle("active");

            // Toggle between hiding and showing the active panel
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    $('[webinar-hide-before]').each(function() {
      if ($(this).attr('webinar-hide-before') <= getCompareDate()) {
        $(this).show();
      }
    });

    $('[webinar-hide-after]').each(function() {
      if ($(this).attr('webinar-hide-after') >= getCompareDate()) {
        $(this).show();
      }
    });

    // When we show the section nav on xs/sm, clear the main content below the nav
    $('.sm-section-nav').on('shown.bs.dropdown', function() {
        $('main').addClass('section-nav-open');
    });
    // When we hide the section nav on xs/sm, reset the main content next to the nav
    $('.sm-section-nav').on('hidden.bs.dropdown', function() {
        $('main').removeClass('section-nav-open');
    });

    //When the destination changes, fire the map script and set the lat-long.
    $('#dropdown-dest-addresses').change(function(e){
        const lat = $('input[type=radio][name=address]:checked').attr('lat');
        const long = $('input[type=radio][name=address]:checked').attr('long');
        GetMapWithLine(lat, long, null, null, null, showInfobox);
    });

    //When the source changes, fire the map script with source and dest lat-long.
    $('#dropdown-src-addresses').change(function(e){
        const lat     = $('input[type=radio][name=address]:checked').attr('lat');
        const long    = $('input[type=radio][name=address]:checked').attr('long');
        const srcLat  = $('input[type=radio][name=srcAddress]:checked').attr('lat');
        const srcLong = $('input[type=radio][name=srcAddress]:checked').attr('long');

        // check if both address are in the US
        const addressType = $('input[type=radio][name=address]:checked').attr('addressType') === 'national';
        const srcType = $('input[type=radio][name=srcAddress]:checked').attr('addressType') === 'national';

        const usAddresses = addressType && srcType;

        GetMapWithLine(lat, long, srcLat, srcLong, usAddresses, showInfobox);
    }); 

    $('#dropdown-addresses').trigger('change');
});