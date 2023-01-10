function Write-Step {
    param (
        [Parameter(Mandatory=$true)]
        [string]$text
    )
    
    Write-Output ('=' * $text.Length)
    Write-Output $text
    Write-Output ('=' * $text.Length)
}

function Write-Hash {
    param (
        [Parameter(Mandatory=$true)]
        [string]$text,
        [Parameter(Mandatory=$true)]
        [Object]$hash
    )
    
    Write-Output $text
    Write-Output ('=' * $text.Length)
    Write-Output $hash
}