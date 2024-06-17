

# Import PSColor module for colorful output

#First, install the PSColor module if you haven't already : run in ps ..  
#Install-Module -Name PSColor -Scope CurrentUser

Param (
    [string]$LambdaName
)


Import-Module PSColor

# Calculate startTime and endTime in milliseconds
$startTime = [math]::Round((New-TimeSpan -Start (Get-Date "1970-01-01 00:00:00Z") -End (Get-Date).AddDays(-1).ToUniversalTime() ).TotalMilliseconds)
$endTime = [math]::Round((New-TimeSpan -Start (Get-Date "1970-01-01 00:00:00Z") -End (Get-Date).ToUniversalTime()).TotalMilliseconds)

# Fetch log events using AWS CLI
$logEvents = aws logs filter-log-events --log-group-name /aws/lambda/$LambdaName --start-time $startTime --end-time $endTime | ConvertFrom-Json

# Extract necessary fields from the log events
$formattedLogEvents = $logEvents.events | Select-Object -Property timestamp, message

# Define color functions
function Write-ColoredText {
    param (
        [string]$Text,
        [string]$Color
    )
    Write-Host $Text -ForegroundColor $Color
}

# Convert timestamp to local date and time
function Convert-TimestampToDateTime {
    param (
        [long]$Timestamp
    )
    $epoch = [DateTime]::new(1970, 1, 1, 0, 0, 0, [DateTimeKind]::Utc)
    $dateTimeUtc = $epoch.AddMilliseconds($Timestamp)
    return $dateTimeUtc.ToLocalTime()
}

# Print the log events in a colorful and formatted manner
foreach ($event in $formattedLogEvents) {
    $localDateTime = Convert-TimestampToDateTime -Timestamp $event.timestamp
    $formattedDateTime = $localDateTime.ToString("dd/MM/yyyy HH:mm:ss")
    Write-ColoredText "Date & Time : $formattedDateTime" "Blue"
    Write-ColoredText "Message  : $($event.message)" "Green"
    # Write-ColoredText "Message  : $($event.message)" "Yellow"
    Write-Host ""  # Add an empty line for better readability
}
