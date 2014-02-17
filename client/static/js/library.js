/*
 * Copyright (C) 2013-2014 Project Hatohol
 *
 * This file is part of Hatohol.
 *
 * Hatohol is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * Hatohol is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Hatohol. If not, see <http://www.gnu.org/licenses/>.
 */

Array.prototype.uniq = function() {
  var o = {}, i, len = this.length, r = [];
  for (i = 0; i < len; ++i) o[this[i]] = true;
  for (i in o) r.push(i);
  return r;
};

function padDigit(val, len) {
  var s = "00000000" + val;
  return s.substr(-len);
}

function formatDate(str) {
  var val = new Date();
  val.setTime(Number(str) * 1000);
  var d = val.getFullYear() + "/" + padDigit(val.getMonth() + 1, 2) + "/" + padDigit(val.getDate(), 2);
  var t = padDigit(val.getHours(), 2) + ":" + padDigit(val.getMinutes(), 2) + ":" + padDigit(val.getSeconds(), 2);
  return d + " " + t;
}

function formatSecond(sec) {
  var t = padDigit(parseInt(sec / 3600), 2) + ":" + padDigit(parseInt(sec / 60) % 60, 2) + ":" + padDigit(sec % 60, 2);
  return t;
}

function setCandidate(target, list) {
  var x;
  var html = "<option>---------</option>";

  target.empty().append(html);

  if (list) {
    target.removeAttr("disabled");
    for (x = 0; list && x < list.length; ++x) {
      var option = $("<option/>");
      option.text(list[x]);
      target.append(option);
    }
  } else {
    target.attr("disabled", "disabled");
  }
}

function setStatus(value) {
  var elem;
  var x;
  var s;

  if ("class" in value) {
    $("#sts button").attr("class", "navbar-btn btn btn-" + value["class"]);
  }

  if ("label" in value) {
    elem = $("#sts button span:first");
    elem.empty();
    elem.append(value["label"]);
  }

  if (value.lines && value.lines.length > 0) {
    s = "";
    for (x = 0; x < value["lines"].length; ++x) {
      s += "<li>" + value["lines"][x] + "</li>";
    }

    elem = $("#sts ul");
    elem.empty();
    elem.append(s);
    $("#sts button").attr("data-toggle", "dropdown");
  } else {
    $("#sts button").removeAttr("data-toggle");
  }
}

function updateScreen(reply, completionCallback, callbackParam) {
  setStatus({
    "class" : "warning",
    "label" : gettext("DRAW"),
    "lines" : [ gettext("Drawing") ],
  });

  completionCallback(reply, callbackParam);

  setStatus({
    "class" : "success",
    "label" : gettext("DONE"),
    "lines" : [],
  });
}

function startConnection(tableName, completionCallback, callbackParam) {
  setStatus({
    "class" : "warning",
    "label" : gettext("LOAD"),
    "lines" : [ gettext("Communicating with backend") ],
  });

  var connParam =  {
    url: '/' + tableName,
    replyCallback: function(reply, parser) {
      updateScreen(reply, completionCallback, callbackParam);
    },
    parseErrorCallback: function(reply, parser) {
      // We assume the parser is HatoholReplyParser.
      var msg = parser.getMessage();
      if (!msg)
        msg = gettext("Failed to parse the received packet.");
      hatoholErrorMsgBox(msg);

      setStatus({
        "class" : "danger",
        "label" : gettext("ERROR"),
        "lines" : [ msg ],
      });
    }
  };
  new HatoholConnector(connParam);
}

function makeTriggerStatusLabel(status) {
  switch(status) {
  case TRIGGER_STATUS_OK:
    return gettext("OK");
  case TRIGGER_STATUS_PROBLEM:
    return gettext("Problem");
  default:
    return "INVALID: " + status;
  }
}

function makeSeverityLabel(severity) {
  switch(severity) {
  case TRIGGER_SEVERITY_UNKNOWN:
    return gettext("Not classified");
  case TRIGGER_SEVERITY_INFO:
    return gettext("Information");
  case TRIGGER_SEVERITY_WARNING:
    return gettext("Warning");
  case TRIGGER_SEVERITY_ERROR:
    return gettext("Average");
  case TRIGGER_SEVERITY_CRITICAL:
    return gettext("High");
  case TRIGGER_SEVERITY_EMERGENCY:
    return gettext("Disaster");
  default:
    return "INVALID: " + severity;
  }
}

function makeMonitoringSystemTypeLabel(type) {
  switch (type) {
  case MONITORING_SYSTEM_ZABBIX:
    return "ZABBIX";
  case MONITORING_SYSTEM_NAGIOS:
    return "NAGIOS";
  default:
    return "INVALID: " + type;
  }
}

function getServerLocation(server) {
  var ipAddress, port, url;

  if (!server)
    return undefined;

  switch (server["type"]) {
  case hatohol.MONITORING_SYSTEM_ZABBIX:
    ipAddress = server["ipAddress"];
    port = server["port"];
    url = "http://" + ipAddress;
    if (!isNaN(port) && port != "80")
      url += ":" + port;
    url += "/zabbix/";
    break;
  default:
    break;
  }
  return url;
}

function getItemGraphLocation(server, itemId) {
  var location = getServerLocation(server);
  if (!location)
    return undefined;

  switch (server["type"]) {
  case hatohol.MONITORING_SYSTEM_ZABBIX:
    location += "history.php?action=showgraph&amp;itemid=" + itemId;
    break;
  default:
    return undefined;
  }
  return location;
}

function getMapsLocation(server) {
  var location = getServerLocation(server);
  if (!location)
    return undefined;

  switch (server["type"]) {
  case hatohol.MONITORING_SYSTEM_ZABBIX:
    location += "maps.php";
    break;
  default:
    return undefined;
  }
  return location;
}

function getServerName(server, serverId) {
  if (!server)
    return "Unknown:" + serverId;
  return server["name"];
}

function getHostName(server, hostId) {
  if (!server)
    return "Unknown:" + hostId;
  return server["hosts"][hostId]["name"];
}

function hasFlag(user, flag) {
  return hasFlags(user, (1 << flag));
}

function hasFlags(user, flags) {
  if (!user)
    return false;
  return user.flags & flags;
};

var escapeHTML = function(html) {
  return $('<div/>').text(html).html();
};
