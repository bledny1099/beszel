// Package beszel provides core application constants and version information
// which are used throughout the application.
package beszel

import "github.com/blang/semver"

const (
	// Version is the current version of the application.
	Version = "0.0.4"
	// AppName is the name of the application.
	AppName = "beszel"
)

// MinVersionCbor is the minimum supported version for CBOR compatibility.
var MinVersionCbor = semver.MustParse("0.0.0")

// MinVersionAgentResponse is the minimum supported version for AgentResponse compatibility.
var MinVersionAgentResponse = semver.MustParse("0.0.0")

// MinVersionZfsData is the minimum agent version that supports ZFS detail requests.
var MinVersionZfsData = semver.MustParse("0.0.0")

// MinVersionNetworkMonitors is the minimum agent version that supports network monitor sync.
var MinVersionNetworkMonitors = semver.MustParse("0.0.0")
