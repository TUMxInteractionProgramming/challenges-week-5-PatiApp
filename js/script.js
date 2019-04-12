/* start the external action and say hello */
console.log("App is alive");

var channels = [yummy, sevencontinents, killerapp, firstpersononmars, octoberfest];

/** Create global variable */
var currentChannel;

/** selected channel by default: sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};


/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);
    // Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* remove either class */
    $('#chat h1 i').removeClass('far fas');

    /* set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fas' : 'far');

    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');
    currentChannel = channelObject;
    abortCreateChannel();
}

function star() {
    $('#chat h1 i').toggleClass('far');
    $('#chat h1 i').toggleClass('fas');
    currentChannel.starred = !currentChannel.starred;
    $('#channels li:contains(' + currentChannel.name + ') .fa-star').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa-star').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

function toggleEmojis() {
    var emojis = require('emojis-list');
    $('#emojis').empty();
    for (emoticon = 0; emoticon < emojis.length; emoticon++) {
        $('#emojis').append(emojis[emoticon] + "");
    }
    $('#emojis').toggle();
}

/**
 * This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    this.createdOn = new Date()
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    this.text = text;
    this.own = true;
}

function sendMessage() {
    if ($('#message').val() == "") {
        return;
    }
    var message = new Message($('#message').val());
    console.log("New message:", message);
    currentChannel.messages.push(message);
    $('#messages').append(createMessageElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    $('#message').val('');
    currentChannel.messageCount += 1;
}

/**
 * This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    return '<div class="message' +
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">' +
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn + ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}

function listChannels(criterion) {
    $('#channels ul').empty();
    channels.sort(criterion);
    for (var i in channels) {
        $('#channels ul').append(createChannelElement(channels[i]));
    };
}

function compareNewCreatedOn(a, b) {
    return (b.createdOn - a.createdOn);
}

function compareTrendingMessageCount(a, b) {
    return (b.messageCount - a.messageCount);
}

function compareFavoriteStarred(a, b) {
    return (b.starred - a.starred);
}


function initializeCreateChannel() {
    $('#messages').empty();
    $('#app-bar-channel-name').hide();
    $('#send-message-button').hide();
    $('#create-channel-app-bar').addClass('show');
    $('#create-channel-button').show();
}

function abortCreateChannel() {
    $('#create-channel-app-bar').removeClass('show');
    $('#create-channel-button').hide();
    $('#send-message-button').show();
    $('#app-bar-channel-name').show();
    $('#messages').val();
}

/**
 * @param name `String` a new channel
 * @constructor
 */
function Channel(name) {
    this.name = name;
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    this.createdOn = new Date();
    this.expiresIn = 60;
    this.starred = true;
    this.messages = [];
    this.messageCount = 1;
}

// creating a new channel with # at the begining and push it to channels array
function createChannel() {
    var name = $('#create-channel').val();
    if (name == ""
        || name.indexOf(" ") > -1
        || name.indexOf("#") != 0
        || name.substring(1).indexOf("#") > -1)
        return;
    var message = $('#message').val();
    if (message == "")
        return;
    abortCreateChannel();
    var channelObject = new Channel(name);
    currentChannel = channelObject;
    channels.push(channelObject);
    $('#channels ul').append(createChannelElement(channelObject));
    document.getElementById('channel-name').innerHTML = channelObject.name;
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';
    $('#create-channel').val('');
    sendMessage();
}


/**
 * This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    // create a channel
    var channel = $('<li>').text(channelObject.name);
    var channelObjectName = channelObject.name.substr(1).toLowerCase();
    channel.attr('onclick', 'switchChannel(' + channelObjectName + ')');

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}



