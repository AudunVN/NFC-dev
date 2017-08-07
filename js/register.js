var SPONSOR_ID = 2;
var SUPER_SPONSOR_ID = 3;
var DAY_TICKET_ID = 4;
var MAX_BUFFET_TICKETS = 4;
var MAX_TSHIRTS = 3;
var MAX_EXTRA_FURSUIT_BADGES = 5;

var form_wrapper = $ ("#regform_wrap");

var form_data;

var modals = {
	test_modal: "hello",
	nope: "hah",
}

var Error = function Error(message, msg_input_obj) {
	// message to put in error list and near input
    this.message = message;
	// for adding error classes to highlight input, and adding the error message
    this.msg_input_obj = msg_input_obj;
};

/* error object demo */
var test_error = new Error("Invalid accommodation", $("#accommodation"));

/* to-do: check that there is server-side protection 
   against this as well, client-side form validation
   is in general pretty optimistic since anybody can
   send a post request with anything they want
   regardless of what JavaScript we use here to
   clean the form */
   
function noscript(strCode) {
    var html = $(strCode.bold());
    html.find('script').remove();
    return html.html();
}

$(document).ready(function () {
	/* prefill fields from profile data */
	$('#nickname').val(_userData.nickName);
    if (_userData.country != "") {
        $("#CountryId option").filter(function () {
            return $(this).text() == _userData.country.trim();
        }).prop('selected', true);
    }
	
	/* group state handler - form changes based on attending type go here */
    $('#attending_type').on('change', function () {
        var groupId = $(this).find(':selected').data('groupid');

        switch (groupId) {
            case SPONSOR_ID:
				form_wrapper.addClass("sponsor-selected");
				form_wrapper.removeClass("super-sponsor-selected");
				form_wrapper.removeClass("day-ticket-selected");
				/* to-do
                $('#accommodationMainDays').show();                
                $('.sponsor.bonus-options').show();
                $('.superSponsor.bonus-options').hide();
                $('#superSponsor_tshirt_size').val('0');
                $('#superSponsor_ice_cream_buffet').val('0');
				*/
                break;
            case SUPER_SPONSOR_ID:
				form_wrapper.addClass("super-sponsor-selected");
				form_wrapper.removeClass("sponsor-selected");
				form_wrapper.removeClass("day-ticket-selected");
				/* to-do
                $('#accommodationMainDays').show();           
                $('.superSponsor.bonus-options').show();
                $('.sponsor.bonus-options').hide();
                $('#superSponsor_ice_cream_buffet').val($('#superSponsor_ice_cream_buffet').data('defaultval'));
                $('#sponsor_tshirt_size').val('0');
                $('#sponsor_ice_cream_buffet').val('0');
				*/
                break;
            case DAY_TICKET_ID:
				form_wrapper.addClass("day-ticket-selected");
				form_wrapper.removeClass("sponsor-selected");
				form_wrapper.removeClass("super-sponsor-selected");
				/* to-do
                $('#accommodationMainDays').hide();
                $('#accommodationExtraDays').hide();
                $('#accomodation_type').val('0');
                $('#accomodation_type_super_early_arrival').val('0');
                $('#accomodation_type_early_arrival').val('0');
                $('#accomodation_type_late_departure').val('0');
                $('.bonus-options').hide();
				*/
                break;
            default:
				form_wrapper.removeClass("sponsor-selected");
				form_wrapper.removeClass("super-sponsor-selected");
				form_wrapper.removeClass("day-ticket-selected");
				/* to-do
                $('#accommodationMainDays').show();                
                $('.bonus-options').hide();
				*/
                break;
        }
    });
	
    $('#fursuiter').on('change', function () {
        if ($(this).is(':checked')) {
            $('#buy_more_fursuit_badges').prop('disabled', false);
        } else {
            $("#buy_more_fursuit_badges").val($("#buy_more_fursuit_badges option:first").val());
            $('#buy_more_fursuit_badges').prop('disabled', true);
        }
    });

    $('#accomodation_type').on('change', function () {
        switch ($(this).find(':selected').val()) {
            case -1:
            case 0:
            case '':
				form_wrapper.removeClass("extra-days-selected");
                break;
            default:
				form_wrapper.addClass("extra-days-selected");
                break;
        }

        if (_accomodations_and_people_in_room[$(this).val()] > 1) {
            var message = '<p>For all room types except single rooms, you will have to share the room with one or several other attendees. Room mates will be selected at random unless you enter a specific attendee you wish to share a room with. They will have to verify your request before the room share is valid.</p>' +
                      '<p>The room sharing option is located under My Account once your booking has been approved.</p>';
            showDialog('Room sharing', message, true);
        }
    });
	
	/* applied to inputs that affect the price */
	$(".affects-price").each(function(){
		$(this).on("change", function() {
			computePrice();
		});
	});
	
	/* on-select modal renderer */
	
	$("[data-on-select-modal]").each(function(){
		$(this).on("change", function() {
			if ($(this).is(':checked')) {
				showModal(modal=modals[$(this).data("on-select-modal")]);
			}
		});
	});
	
    $('#regform').submit(function (e) {
		e.preventDefault();
		cleanForm();
		errors = validateForm();
		if (len(errors) == 0) {
			/* to-do */
			/* for each input */
				/* switch case based on input type */
					/* if input has model form field class */
					/* set form_data["model form field name"] to value */
			/* run custom handlers for remaining composite data types */
			/* send AJAX POST request containing form_data to reg_data url */
		}
	});
	
	$("input").each(function(){
		$(this).on("change", function() {
			cleanForm();
		});
	});
	
	updateForm();
});

function updatePrice() {
	$(".affects-price").each(function(){
		$(this).find("[data-price]:selected").data("price");
	});
}

function validateForm() {
	/* returns list of Error objects */
	var errors = [];
	$("[required]").each(function(){
		$(this).find("[data-price]:selected").data("price");
	});
	return errors;
}

function updatePrice() {
	$(".affects-price").each(function(){
		$(this).find("[data-price]:selected").data("price");
	});
}

function cleanForm() {
	/* uncheck attributes that require prior checkboxes */
	if !formWrapper.hasClass("extra-days-selected") {
		$('#accomodation_type_super_early_arrival').val('0');
		$('#accomodation_type_early_arrival').val('0');
		$('#accomodation_type_late_departure').val('0');
	}
}

function updateForm() {
    $.getJSON(_accomodation_data_url, function (data) {
        try {
			/* to-do */
			form_wrapper.addClass("accommodation-loaded");
        }
        catch (err) {
            $('#regstatus').html('<h4>A problem occured while loading accommodation data!</h4><p>Error message: ' + err.message + '</p><p>Please contact our <a href="mailto:webmaster@nordicfuzzcon.org">webmaster</a> about it!</p>');;
        }
    })
    .fail(function () {
        $('#regstatus').html('<h4>A problem occured while loading accommodation data!</h4><p>Please contact our <a href="mailto:webmaster@nordicfuzzcon.org">webmaster</a> about it!</p>');
    });

    $.getJSON(_reg_data_url, function (data) {
        try {
			/* to-do
            //accomodation type
            var html = '<option selected value="-1" data-price="0" data-earlyarrival="0" data-latedeparture="0">Please choose...</option>';
            html += '<option value="0" data-price="0" data-earlyarrival="0" data-latedeparture="0">No accomodation</option>';
            $.each(data.Data.AccomodationItems, function (index, item) {
                html += '<option data-superearlyarrival="' + item.PriceSuperEarlyArrival + '" data-earlyarrival="' + item.PriceEarlyArrival + '" data-latedeparture="' + item.PriceLateDeparture + '" data-price="' + item.Price + '" value="' + item.AccomodationTypeId + '">' + item.RoomName + ' (' + item.Price + ' SEK) </option>';
                _accomodations_and_people_in_room[item.AccomodationTypeId] = item.NumberOfPeopleInRoom;
            });
            $('#accomodation_type').append(html);

            // Super early arrival
            $('#accomodation_type_super_early_arrival').append('<option selected value="0" data-price="0">No super early arrival room</option>');
            $.each(data.Data.AccomodationSuperEarlyItems, function (index, item) {
                if (item.ItemsLeftInStock > 0)
                    $('#accomodation_type_super_early_arrival').append('<option data-price="' + item.Price + '" value="' + item.ProductId + '">' + item.Name + ' (' + item.Price + ' SEK) - ' + item.ItemsLeftInStock + ' room slots left</option>');
                else
                    $('#accomodation_type_super_early_arrival').append('<option data-price="0" value="-1">' + item.Name + ' (' + item.Price + ' SEK) - (sold out)</option>');
            });
            // Early arrival
            $('#accomodation_type_early_arrival').append('<option selected value="0" data-price="0">No early arrival room</option>');
            $.each(data.Data.AccomodationEarlyItems, function (index, item) {
                if (item.ItemsLeftInStock > 0)
                    $('#accomodation_type_early_arrival').append('<option data-price="' + item.Price + '" value="' + item.ProductId + '">' + item.Name + ' (' + item.Price + ' SEK) - ' + item.ItemsLeftInStock + ' room slots left</option>');
                else
                    $('#accomodation_type_early_arrival').append('<option data-price="0" value="-1">' + item.Name + ' (' + item.Price + ' SEK) - (sold out)</option>');
            });
            // Early arrival
            $('#accomodation_type_late_departure').append('<option selected value="0" data-price="0">No late departure room</option>');
            $.each(data.Data.AccomodationLateItems, function (index, item) {
                if (item.ItemsLeftInStock > 0)
                    $('#accomodation_type_late_departure').append('<option data-price="' + item.Price + '" value="' + item.ProductId + '">' + item.Name + ' (' + item.Price + ' SEK) - ' + item.ItemsLeftInStock + ' room slots left</option>');
                else
                    $('#accomodation_type_late_departure').append('<option data-price="0" value="-1">' + item.Name + ' (' + item.Price + ' SEK) - (sold out)</option>');
            });

            //attending_type
            html = '<option selected value="0" data-price="0" data-groupid="0">Please select...</option>';
            $.each(data.Data.AttendingItems, function (index, item) {
                html += '<option data-groupid="' + item.GroupId + '" data-price="' + item.Price + '" value="' + item.AttendingTypeId + '">' + item.Name + ' (' + item.Price + ' SEK) </option>';
            });
            $('#attending_type').append(html);
            //buffet tickets
            $('#buffet_tickets').append('<option selected data-price="0" value="0">None</option>');            
            for (cpt = 1; cpt <= _max_buffet_tickets; cpt++) {
                price = data.Data.BuffetTickets[0].Price * cpt;
                $('#buffet_tickets').append('<option data-price="' + price + '" value="' + cpt + '">' + cpt + ' (' + cpt + ' x ' + data.Data.BuffetTickets[0].Price + ' = ' + price + ' SEK)</option>');
            }
            $('#buffet_tickets').append('<option data-price="' + data.Data.BuffetTicketsAllInclusive[0].Price + '" value="9999">' + data.Data.BuffetTicketsAllInclusive[0].Name + ' (' + data.Data.BuffetTicketsAllInclusive[0].Price + ' SEK)</option>');
            $('#buffet_tickets').data('price', data.Data.BuffetTickets[0].Price);
            //eat sweden
            $('#eat_sweden').data('price', data.Data.EventEatSweden[0].Price);
            $('.eat_sweden .label-value').html('Eat Sweden (' + data.Data.EventEatSweden[0].Price + ' SEK)');
            //dzing dog dinner
            $('#dead_dog').data('price', data.Data.DeadDog[0].Price);
            $('.dead_dog .label-value').html('Dying Dog Dinner (' + data.Data.DeadDog[0].Price + ' SEK)');
            //skansen
            var skansenCost = parseInt(data.Data.Skansen[0].Price) + parseInt(data.Data.SkansenBus[0].Price);
            $('#skansen').data('price', skansenCost);
            $('.skansen .label-value').html('Skansen - ' + data.Data.SkansenBus[0].ItemsLeftInStock + ' tickets remaining (' + skansenCost + ' SEK)');
            //furry bus  
            $('#furry_bus_arrival').append('<option selected value="0" data-price="0">No FuzzBus</option>');
            $.each(data.Data.FurryBusArrival, function (index, item) {
                if (item.ItemsLeftInStock > 0)
                    $('#furry_bus_arrival').append('<option data-price="' + item.Price + '" value="' + item.ProductId + '">' + item.Name + ' (' + item.Price + ' SEK) - ' + item.ItemsLeftInStock + ' tickets left</option>');
                else
                    $('#furry_bus_arrival').append('<option data-price="0" value="0">' + item.Name + ' (' + item.Price + ' SEK) - (sold out)</option>');
            });

            $('#furry_bus_departure').append('<option selected value="0" data-price="0">No FuzzBus</option>');
            $.each(data.Data.FurryBusDeparture, function (index, item) {
                if (item.ItemsLeftInStock > 0)
                    $('#furry_bus_departure').append('<option data-price="' + item.Price + '" value="' + item.ProductId + '">' + item.Name + ' (' + item.Price + ' SEK) - ' + item.ItemsLeftInStock + ' tickets left</option>');
                else
                    $('#furry_bus_departure').append('<option data-price="0" value="0">' + item.Name + ' (' + item.Price + ' SEK) - (sold out)</option>');
            });

            //sponsor
            html = '<option selected value="0">Please select...</option>';
            $.each(data.Data.FreeTshirts, function (index, item) {
                html += '<option value="' + item.ProductId + '">' + item.Name + '</option>';
            });
            $('#sponsor_tshirt_size').append(html);
            $('.sponsor_ice_cream_buffet .label-value').html(data.Data.SponsorIcecreamBuffet[0].Name + ' (' + data.Data.SponsorIcecreamBuffet[0].Price + ' SEK)');
            $('#sponsor_ice_cream_buffet').data('price', data.Data.SponsorIcecreamBuffet[0].Price);
            $('#sponsor_ice_cream_buffet').val(data.Data.SponsorIcecreamBuffet[0].ProductId);
            $('#sponsor_ice_cream_buffet').data('defaultval', data.Data.SponsorIcecreamBuffet[0].ProductId);
            //superSponsor
            html = '<option selected value="0">Please select...</option>';
            $.each(data.Data.FreeTshirts, function (index, item) {
                html += '<option value="' + item.ProductId + '">' + item.Name + '</option>';
            });
            $('#superSponsor_tshirt_size').append(html);
            $('#superSponsor_ice_cream_buffet_label').html(data.Data.SuperSponsorIcecreamBuffet[0].Name);
            $('#superSponsor_ice_cream_buffet').val(data.Data.SuperSponsorIcecreamBuffet[0].ProductId);
            $('#superSponsor_ice_cream_buffet').data('defaultval', data.Data.SuperSponsorIcecreamBuffet[0].ProductId);
            //buy more t-shirts
            $('#buy_more_tshirts').append('<option selected data-price="0" value="0">None</option>');
            for (cpt = 1; cpt <= _max_tshirts; cpt++) {
                price = data.Data.Tshirts[0].Price * cpt;
                $('#buy_more_tshirts').append('<option data-price="' + price + '" value="' + cpt + '">' + cpt + ' (' + cpt + ' x ' + data.Data.Tshirts[0].Price + ' = ' + price + ' SEK)</option>');
            }
            $('#buy_more_tshirts').data('price', data.Data.Tshirts[0].Price);

            $('#buy_more_tshirts_size').append('<option selected value="0">Please select...</option>');
            $.each(data.Data.Tshirts, function (index, item) {
                $('#buy_more_tshirts_size').append('<option value="' + item.ProductId + '">' + item.Name + '</option>');
            });

            //buy more fursuit badges
            $('#buy_more_fursuit_badges').append('<option selected data-price="0" value="0">None</option>');
            for (cpt = 1; cpt <= _max_extra_fursuit_badges; cpt++) {
                price = data.Data.ExtraFursuitBadges[0].Price * cpt;
                $('#buy_more_fursuit_badges').append('<option data-price="' + price + '" value="' + cpt + '">' + cpt + ' (' + cpt + ' x ' + data.Data.ExtraFursuitBadges[0].Price + ' = ' + price + ' SEK)</option>');
            }
            $('#buy_more_tshirts').data('price', data.Data.Tshirts[0].Price);

            $('i.buffet_tickets').on('click', function () {
                showDialog(data.Data.BuffetTickets[0].Name, '<p>' + data.Data.BuffetTickets[0].Details + '</p>', true);
            });
            $('i.eat_sweden').on('click', function () {
                showDialog(data.Data.EventEatSweden[0].Name, '<p>' + data.Data.EventEatSweden[0].Details + '</p>', true);
            });
            $('i.skansen').on('click', function () {
                showDialog(data.Data.Skansen[0].Name, '<p>' + data.Data.Skansen[0].Details + '</p>', true);
            });
            $('i.dead_dog').on('click', function () {
                showDialog(data.Data.DeadDog[0].Name, '<p>' + data.Data.DeadDog[0].Details + '</p>', true);
            });
            $('i.sponsor_tshirt_size').on('click', function () {
                showDialog('T-shirt', '<p>' + data.Data.FreeTshirts[0].Details + '</p>', true);
            });
            $('i.sponsor_ice_cream_buffet').on('click', function () {
                showDialog(data.Data.SponsorIcecreamBuffet[0].Name, '<p>' + data.Data.SponsorIcecreamBuffet[0].Details + '</p>', true);
            });
            $('i.superSponsor_tshirt_size').on('click', function () {
                showDialog('T-shirt', '<p>' + data.Data.FreeTshirts[0].Details + '</p>', true);
            });
            $('i.superSponsor_ice_cream_buffet').on('click', function () {
                showDialog(data.Data.SuperSponsorIcecreamBuffet[0].Name, '<p>' + data.Data.SuperSponsorIcecreamBuffet[0].Details + '</p>', true);
            });
			*/
			
			form_wrapper.addClass("reg-data-loaded");
			/* to-do
            $('#regstatus').hide();
            $('#regstatus').removeClass('loading');
            $('#regform_wrap').show();
			*/
        }
        catch (err) {
            $('#regstatus').html('<h4>A problem occured while loading the registration form!</h4><p>Error message: ' + err.message + '</p><p>Please contact our <a href="mailto:webmaster@nordicfuzzcon.org">webmaster</a> about it!</p>');;
        }
    })
    .fail(function () {
        $('#regstatus').html('<h4>A problem occured while loading the registration form!</h4><p>Please contact our <a href="mailto:webmaster@nordicfuzzcon.org">webmaster</a> about it!</p>');
    });
}