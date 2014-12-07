
if (Meteor.isClient) {

	Meteor.autosubscribe(function (){
	  Meteor.subscribe("userdata")  
	})

	var generateQrCode = function (btcAmount, template){

    	var qrcode = "bitcoin:1NUzDGxfweYooDgqVhTryaaccto4e2bKRp?amount=" + btcAmount;

    	$('#qr').empty();
    	$('#qr').qrcode({text: qrcode, width: 300,height: 300,});

	}

	var recalculateAmount = function (template){

		var rate = 423; //get rate from server
    	var cadAmount = template.find("#amount").value.toString();
    	var tipAmount = template.find("input:radio[name=tip]:checked").value.toString();
    	var btcAmount = Math.round((cadAmount * (1+(tipAmount/100)) / rate) * 10000)  / 10000;;

    	document.getElementById("btcAmount").innerHTML = btcAmount;

    	return btcAmount;

	}

	Template.billing.helpers({
		merchantName: function(){

			var user = Meteor.users.findOne({_id: Meteor.userId()});

			if (user != null && user.profile != null && user.profile.merchantName) return user.profile.merchantName;
	
			return "";

		},
		merchantLogo: function(){

			var user = Meteor.users.findOne({_id: Meteor.userId()});

			if (user != null && user.profile != null && user.profile.merchantLogo) return user.profile.merchantLogo;
	
			return "";

		},
		rate: function(){
			
			var currentRate = Rates.findOne();

			console.log(currentRate);

			if (currentRate != null) return currentRate.data.bid;
	
			return "";

		},
		address: function(){
			return "1NUzDGxfweYooDgqVhTryaaccto4e2bKRp";
		},
		status: function(){
			return "Some status";
		},
		unit: function(){
			return "BTC";
		}
	});

  Template.billing.rendered = function(){
    $('#qr').qrcode({text: 'bitcoin:1NUzDGxfweYooDgqVhTryaaccto4e2bKRp?amount=0.00000000', width: 300, height: 300});
  };

  Template.billing.events({
    'keyup #amount': function(event, template){
    	var btcAmount = recalculateAmount(template);
    	generateQrCode(btcAmount, template);
    },
    'change ': function (event, template) {
    	var btcAmount = recalculateAmount(template);
    	generateQrCode(btcAmount, template);
    }

  });

}
